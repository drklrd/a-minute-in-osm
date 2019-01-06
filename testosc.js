const fs = require("fs");
const xml2js = require("xml2js");
const parser = new xml2js.Parser();

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

let stats = {
	users : [],
	changesets : [],
	wayBuildings : 0
};

ReadXMLFile("./data/test.osc")
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
		stats["createdDate"] = new Date();
		console.log(stats);
	})
	.then((res)=>{
		console.log("done");
	})
	.catch((err)=>{
		console.log("err",err)
	});