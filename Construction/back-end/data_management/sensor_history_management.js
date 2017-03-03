var mongoose = require('mongoose');
var schema = require('./schema');
var cropUserManagement = require('../data_management/crop_user_management');
var sensorManagement = require('../data_management/sensor_management');
var thingSpeak = require('../data_management/thing_speak');
var common = require('./common');

var SensorHistoryManagement = schema.SensorHistory;
var queryCropUserId = cropUserManagement.queryCropUserId;
var querySensorId = sensorManagement.querySensorId;
var cb;
var field1Queue = thingSpeak.field1Queue;
var field2Queue = thingSpeak.field2Queue;
var field3Queue = thingSpeak.field3Queue;
var topics = common.mqtt_topics;

exports.createSensorHistory = function(sensorType, sensorData, callback) {
    cb = callback;
    var sensorId = querySensorId(sensorType), cropUserId = queryCropUserId();

    if (null == sensorId) {
        cb('[createSensorHistory] sensorId undefined');
        return;
    }

    if (null == cropUserId) {
        cb('[createSensorHistory] cropUserId undefined');
        return;
    }

    var sensorHistoryManagement = createSensorHistoryManagement(sensorType, sensorData, sensorId, cropUserId);
    
    if (null == sensorHistoryManagement) {
        return;
    }

    sensorHistoryManagement.save(function(err) {
        if (err) {
            cb(err);
        } 
    })
}

function createSensorHistoryManagement(sensorType, data, sensorId, cropUserId) {
    var bayTime = common.getBayTime()

    if (!data || 0 === data.length) {
        cb('[createSensorHistoryManagement] ' + sensorType + ' got empty string');
        return null;
    }

    switch (sensorType) {
        case topics[0]:
            var field2 = 'field2=' + data;
            field2Queue.push(field2);
            return new SensorHistoryManagement({sensor_id:sensorId, crop_user_id:cropUserId, value:data, creation_date:bayTime});

        case topics[1]:
            var field1 = 'field1=' + data;
            field1Queue.push(field1);
            return new SensorHistoryManagement({sensor_id:sensorId, crop_user_id:cropUserId, value:data, creation_date:bayTime});

        case topics[2]:
            var field3 = 'field3=' + data;
            field3Queue.push(field3);
            return new SensorHistoryManagement({sensor_id:sensorId, crop_user_id:cropUserId, value:data, creation_date:bayTime});
        
        default:
            cb('[exports.createSensorHistoryManagement] ' + sensorType + ' undefined');
            return null;
    }
}

// Sensor History REST API

exports.all_sensor_history = function(req, res) {
  SensorHistoryManagement.find({}).sort('-creation_date').limit(10).exec(function(err, sensorHistory) {
    if (err)
      res.send(err);
    else
      res.json(sensorHistory);
  });
};



exports.read_sensor_history = function(req, res) {
  SensorHistoryManagement.findById(req.params.sensorId, function(err, sensorHistory) {
    if (sensorHistory == undefined || sensorHistory == null)
      res.status(404).json({message: 'WaterConsumptionHistory record Not found'});
    else if (err)
      res.send(err);
    else
      res.json(sensorHistory);
  });
};


