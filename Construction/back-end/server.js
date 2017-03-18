var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  cors = require('cors');

//To avoid the heroku app going to sleep :)
var http = require("http");
setInterval(function() {
	console.log("App ping");
    http.get("http://smartfarm-sjsu.herokuapp.com/");
}, 300000); // every 5 minutes (300000)

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://52.35.182.188:27017/maindb', function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to MongoDB :' + err);
  } else {
    console.log ('Succeeded connected to MongoDB');
  }
});


//Catch uncaughtExceptions
var response;
process.on('uncaughtException', function (err) {
  console.log("Exception caught",err);
  //response.status(500).send('Something broke!')
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests

var sensor_routes = require('./routes/smartIrrigation-sensor-routes');
var user_routes = require('./routes/smartIrrigation-user-routes');
var crop_routes = require('./routes/smartIrrigation-crop-routes');
var waterHistory_routes = require('./routes/smartIrrigation-waterConsumptionHistory-routes');
var sensorHistory_routes = require('./routes/smartIrrigation-sensorHistory-routes');
var crop_user_routes = require('./routes/smartIrrigation-crop-user-routes');

sensor_routes(app);
user_routes(app);
crop_routes(app);
waterHistory_routes(app);
sensorHistory_routes(app);
crop_user_routes(app);




app.listen(port);


console.log('RESTful API server started on: ' + port);
