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
    http.get("http://sjsusmartfarm-backend.herokuapp.com/");
}, 300000); // every 5 minutes (300000)

mongoose.Promise = global.Promise;
mongoose.connect(process.env.connectionstring, function (err, res) {
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
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	res.header("Access-Control-Allow-Credentials", true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.user(cors())


//app.use(cors()); // CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests

var sensor_routes = require('./routes/smartIrrigation-sensor-routes');
var user_routes = require('./routes/smartIrrigation-user-routes');
var crop_routes = require('./routes/smartIrrigation-crop-routes');
var waterHistory_routes = require('./routes/smartIrrigation-waterConsumptionHistory-routes');
var waterConsumptionPrediction_routes = require('./routes/smartIrrigation-waterConsumptionPrediction-routes');
var sensorHistory_routes = require('./routes/smartIrrigation-sensorHistory-routes');
var crop_user_routes = require('./routes/smartIrrigation-crop-user-routes');
var weather_history_routes = require('./routes/smartIrrigation-weatherHistory-routes')

sensor_routes(app);
user_routes(app);
crop_routes(app);
waterHistory_routes(app);
sensorHistory_routes(app);
crop_user_routes(app);
waterConsumptionPrediction_routes(app);
weather_history_routes(app)


app.listen(port);

module.exports = app
console.log('RESTful API server started on: ' + port);
