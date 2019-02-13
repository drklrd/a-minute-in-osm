const express = require("express");
const fs = require("fs");
const app = express();

// const cronJob = require("./script");
// const useCronJob = true;
// if(!cronJob.running && useCronJob){
// 	cronJob.start(); //start cron job
// 	cronJob.fireOnTick();
// }

const Twit = require('twit');
let T = null;
if(process && process.env && process.env.consumer_key){
	T = new Twit({
	  consumer_key:         process.env.consumer_key,
	  consumer_secret:      process.env.consumer_secret,
	  access_token:         process.env.access_token,
	  access_token_secret:  process.env.access_token_secret,
	  timeout_ms:           60 * 1000,
	});
}

app.use(express.static('client/build'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
  next();
});


app.get("/api/stats/hour", (req, res, next) => {
 const stats = JSON.parse(fs.readFileSync(`./stats.json`, "utf8"));
 res.json({
 	success : 1,
 	stats
 });
});

app.get("/api/keepalive", (req, res, next) => {
	const osmpullscript = require("./osmpullscript");
	osmpullscript.pull()
		.then((done)=>{
			res.json({
				success : 1,
			});
		})
 
});

app.get("/api/twitte/hour", (req, res, next) => {
 	const osmpullscript = require("./osmpullscript");
 	osmpullscript.pull()
 		.then((done)=>{
 			const stats = JSON.parse(fs.readFileSync(`./stats.json`, "utf8"));
 			// Post a tweet
 			if(stats.users.length && stats.wayBuildings){
 				const tweetMessage = `Within this last minute in OSM, ${stats.users.length} users contributed in creating ${stats.changesets.length} changesets. ${stats.wayBuildings} buildings were also created. In total, ${stats.createnode} nodes, ${stats.createway} ways and ${stats.createrelation} realations were created. See more at https://a-minute-in-osm.herokuapp.com`;
 				T.post('statuses/update', { status: tweetMessage },
 				  (err, data, response) => {
 				    if(err){
 				    	res.json({
 				    		err : 1,
 				    		message : err
 				    	})
 				    }
 				    res.json({
 				    	success:1,
 				    	message : "Successfully twitted!"
 				    })
 				  }
 				)
 			}else{
 				res.json({
 					success:1,
 					message : "Noting to tweet"
 				})
 			}
 		})
 		.catch((err)=>{
 			console.log("@@@@",err)
 			res.json({
 				err : 1,
 				message : err
 			})
 		})
});


app.listen((process.env.PORT || 8080), () => {
 console.log("Server running on port 8080");
});