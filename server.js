const express = require("express");
const fs = require("fs");
const app = express();

// const cronJob = require("./script");
// const useCronJob = true;
// if(!cronJob.running && useCronJob){
// 	cronJob.start(); //start cron job
// 	cronJob.fireOnTick();
// }

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


app.listen((process.env.PORT || 8080), () => {
 console.log("Server running on port 8080");
});