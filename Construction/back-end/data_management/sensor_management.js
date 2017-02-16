'use strict';
var common = require('./common')

var mongoose = require('mongoose'),
    schema = require('./schema'),
  Sensor = schema.Sensor;
var topics = common.mqtt_topics

exports.list_sensors = function(req, res) {
  Sensor.find({}, function(err, sensor) {
    if (err)
      res.send(err);
    else
      res.json(sensor);
  });
};


exports.create_sensor = function(req, res) {
  var new_sensor = new Sensor(req.body);
  new_sensor.save(function(err, sensor) {
    if (err)
      res.send(err);
    else
      res.status(201).json(sensor);
  });
};


exports.read_sensor = function(req, res) {
  Sensor.findById(req.params.sensorId, function(err, sensor) {
    if (sensor == undefined || sensor == null)
      res.status(404).json({message: 'Sensor Not found'});
    else if (err)
      res.send(err);
    else
      res.json(sensor);
  });
};


exports.update_sensor = function(req, res) {
  Sensor.findOneAndUpdate(req.params.sensorId, req.body, {new: true}, function(err, sensor) {
    if (sensor == undefined || sensor == null)
      res.status(404).json({message: 'sensor Not found'});
    else if (err)
      res.status(400).json(err);
    else    
      res.json(sensor);
  });
};


exports.delete_sensor = function(req, res) {


  Sensor.remove({
    _id: req.params.sensorId
  }, function(err, sensor) {
    if (err)
      res.status(400).json(err);
    else
      res.json({ message: 'Sensor successfully deleted' });
  });
};

exports.querySensorId = function(sensorType) {
    switch (sensorType) {
        case topics[0]:
            return mongoose.Types.ObjectId("589a81bed5bc860004072f99");
            
        case topics[1]:
            return mongoose.Types.ObjectId("589a84d2d5bc860004072f9a");

        case topics[2]:
            return mongoose.Types.ObjectId("589d5aeca96c1229e7e04d57");
        
        default:
            return null;
    }
}

/* 
var schema = require('./schema');

var SensorManagement = schema.Sensor;

exports.createSensor = function (req,callback){
	var SensorManagement = new SensorManagement(req.body);
    SensorManagement.save(function(err) {
            callback(err);
    });
}

exports.updateSensor = function (query, conditions,callback){
	SensorManagement.findOne(query,function(err,SensorManagement){
		
		if(err)
			return callback(err,null);
		
		if(SensorManagement == null)
			return callback(new Error("SensorManagement not found"),null );
		
		for (var key in conditions){
			
			if(key == 'email'){
				return callback(new Error('Email property cannot be modified'), null)
			}

			if(SensorManagement[key] != null){
				console.log("SensorManagement key exist");
				SensorManagement[key] = conditions[key];
			}else{
				console.log("SensorManagement key does not exist");
				SensorManagement[key] = conditions[key];
			}
		}
		
		
		SensorManagement.save(callback)
	
	});
}

exports.removeSensor = function (req,callback){
	SensorManagement.remove({
            email : req.params.

_id
        }, function(err) {
            callback(err);
    });
} */
