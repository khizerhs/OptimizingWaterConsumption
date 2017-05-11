var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  cors = require('cors');

// To avoid the heroku app going to sleep :)
var http = require("http");
setInterval(function() {
	console.log("App ping");
    http.get("http://sjsusmartfarm-backend.herokuapp.com/");
}, 300000); // every 5 minutes (300000)

app.set('port', port);

var server = http.createServer(app);
app.io = require('socket.io')();
app.io.attach(server);

server.listen(port);

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

app.use(bodyParser.json({limit: '50mb'}));  
app.use(bodyParser.urlencoded({ extended: true }));
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);



//app.use(cors()); // CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests

var sensor_routes = require('./routes/smartIrrigation-sensor-routes');
var user_routes = require('./routes/smartIrrigation-user-routes');
var crop_routes = require('./routes/smartIrrigation-crop-routes');
var waterHistory_routes = require('./routes/smartIrrigation-waterConsumptionHistory-routes');
var waterConsumptionPrediction_routes = require('./routes/smartIrrigation-waterConsumptionPrediction-routes');
var sensorHistory_routes = require('./routes/smartIrrigation-sensorHistory-routes');
var crop_user_routes = require('./routes/smartIrrigation-crop-user-routes');
var weather_history_routes = require('./routes/smartIrrigation-weatherHistory-routes')
var arduino_control_routes = require('./routes/smartIrrigation-arduinoControl-routes')
var websocket = require('./socket/smartIrrigation-websocket')
var mqtt_module = require('./mqtt/mqtt_module')

sensor_routes(app);
user_routes(app);
crop_routes(app);
waterHistory_routes(app);
sensorHistory_routes(app);
crop_user_routes(app);
waterConsumptionPrediction_routes(app);
weather_history_routes(app)
arduino_control_routes(app)
websocket.start_ws(app.io)

module.exports = app
console.log('RESTful API server started on: ' + port);
