const child_process = require('child_process');
const exec = require('child_process').exec;
const fs = require("fs");
const xml2js = require("xml2js");
const parser = new xml2js.Parser();
const request = require("request");
const moment = require("moment");

function ClearDir(){
	return new Promise((resolve,reject)=>{
		exec("rm *.osc && rm *.osc.gz", function(error, stdout, stderr) {
		  resolve();
		});
	})
}

function ExecCommand(command){
	return new Promise((resolve,reject)=>{
		exec(command, function(error, stdout, stderr) {
		  if(error) reject(error);
		  resolve(stdout);
		});
	})
}

function ReadXMLFile(file){
	return new Promise((resolve,reject)=>{
		fs.readFile(`${file}`, function(err, data) {
		    parser.parseString(data, function (err, result) {
		        if(err) reject(err);
		        resolve(result)
		    });
		});
	})
}

function Request(url) {
	return new Promise((resolve, reject) => {
		request({
				url: url
			},
			function(error, response, body) {
				if (error) return reject(err);
				return resolve((response.body));
			}
		);
	})
}

function Download(url){
	const wget = `wget ${url}`;
	return new Promise((resolve,reject) => {
		child_process.exec(wget, function (err, stdout, stderr) {
	        if(err) reject(err);
	        resolve(stdout);
	    });
	})
}

function padString(sequenceNumber){
	let addedZeros="";
	for(let i =0 ; i<(9-sequenceNumber.length); i++){
		addedZeros+="0";
	}
	const paddedString = addedZeros + sequenceNumber;
	return paddedString;
}

function writeStatFile(stats){
	return new Promise((resolve,reject)=>{
		fs.writeFile('stats.json', JSON.stringify(stats), 'utf8', (err,done)=>{
			if(err) reject(err);
			resolve();
		});
	})
}

const granularity = "minute";
const url = `https://planet.openstreetmap.org/replication/${granularity}/state.txt`;
let unzippedFileName;

module.exports = {
	pull : ()=>{
		let stats = {
			users : [],
			changesets : [],
			wayBuildings : 0
		};
		return ClearDir()
		.then((cleared)=>{
			return Request(url);
		})
		.then((response)=>{
			let timesplits = response.split("=")[6].split(":").map((e)=>{
				return e.replace(/[^a-zA-Z0-9--]/g,'');
			})
			stats.timeStamp = `${timesplits[0]}:${timesplits[1]}:${timesplits[2]}`;
			const sequenceNumber = response.split("=")[1].split("\n")[0];
			const paddedString = padString(sequenceNumber);
			fileName = `${paddedString.substring(6,9)}.osc.gz`;
			unzippedFileName = `${paddedString.substring(6,9)}.osc`;
			const minuteUrl = `https://planet.openstreetmap.org/replication/${granularity}/${paddedString.substring(0,3)}/${paddedString.substring(3,6)}/${paddedString.substring(6,9)}.osc.gz`;
			console.log(minuteUrl)
		    return Download(minuteUrl);
		})
		.then((response)=>{
			stats.createdDate = moment(stats.timeStamp).local();
			stats.validatedTime = true;
			return ExecCommand(`gunzip -k ${fileName}`);
		})
		.then((response)=>{
			return ReadXMLFile(unzippedFileName);
		})
		.then((response)=>{
			const data = response;
			const countOn = ['delete','create','modify'];
			countOn.forEach((on)=>{
				if(data.osmChange && data.osmChange[on]){
					data.osmChange[on].forEach((change)=>{
						for(let element in change){
							if(!stats[`${on}${element}`]){
								stats[`${on}${element}`] = change[element].length
							}else{
								stats[`${on}${element}`] += change[element].length
							}
							if(change[element].length){
								change[element].forEach((change)=>{
									if(stats.users.indexOf(change['$'].user) === -1){
										stats.users.push(change['$'].user);
									}
									if(stats.changesets.indexOf(change['$'].changeset) === -1){
										stats.changesets.push(change['$'].changeset);
									}
									if(element === "way" && on === "create"  && change.tag && change.tag.length){
										change.tag.forEach((tag)=>{
											if(tag['$'] && tag['$']['k'] && tag['$']['k'] === "building" && tag['$']['v'] === "yes" ){
												stats.wayBuildings += 1;
											}
											if(tag['$'] && tag['$']['k'] && tag['$']['k'] === "amenity"){
												if(!stats[`amenity_${tag['$']['v']}`]){
													stats[`amenity_${tag['$']['v']}`] = 1;
												}else{
													stats[`amenity_${tag['$']['v']}`] += 1;
												}
											}
										})

									}
								})
							}
						}
					});
				}
			})
			const elements = ['node','way','relation'];
			countOn.forEach((count)=>{
				elements.forEach((element)=>{
					if(!stats[`${count}${element}`]){
						stats[`${count}${element}`] = 0;
					}
				})
			})
			console.log(stats);
			stats.unzippedFileName = unzippedFileName;
			return writeStatFile(stats);
		})
		.then((res)=>{
			console.log("done");
			return true;
		})
		.catch((err)=>{
			console.log("err",err)
		});
	}
}