const express = require("express");
const app = express();

const cronJob = require("./script");
const useCronJob = true;
if(!cronJob.running && useCronJob){
	cronJob.start(); //start cron job
	// cronJob.fireOnTick();
}

app.use(express.static('client/build'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
  next();
});


app.get("/api/stats/hour", (req, res, next) => {
 const stats = require("./stats.json");
 res.json({
 	success : 1,
 	stats
 });
});

app.listen(3000, () => {
 console.log("Server running on port 3000");
});