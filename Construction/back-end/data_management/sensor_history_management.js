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

function createSensorHistory (cropUserId, sensorType, sensorData, callback) {
    
    var sensorId = querySensorId(sensorType)
    if(cropUserId == null || cropUserId == undefined){
      cropUserId = queryCropUserId();
    }
    if (null == sensorId) {
        callback(new Error('[createSensorHistory] sensorId undefined'));
        return;
    }

    if (null == cropUserId) {
        callback(new Error('[createSensorHistory] cropUserId undefined'));
        return;
    }

    var sensorHistoryManagement = createSensorHistoryManagement(sensorType, sensorData, sensorId, cropUserId);
    
    if (null == sensorHistoryManagement) {
        return callback(new Error("Sensor history not created"));
    }

    sensorHistoryManagement.save(callback);
}

function createSensorHistoryFromJson (query,callback){
  createSensorHistory(query.crop_user_id,query.topic,query.value,callback);
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

function getSensorsHistory(query,callback) {

  if((query.start == undefined || query.start == null) && (query.end == null || query.end == undefined)){
    SensorHistoryManagement.find(query).sort('-creation_date').exec(function(err, sensorHistory) {
      callback(err,sensorHistory);
    });
  }else{
    console.log("Date range");
    SensorHistoryManagement.find({crop_user_id : query.crop_user_id, 
      creation_date: {
          $gte: moment(query.start, 'MM-DD-YYYY HH:mm').tz('America/Los_Angeles').format(),
          $lt: moment(query.end, 'MM-DD-YYYY HH:mm').tz('America/Los_Angeles').format()
      }
    }).sort('-creation_date').exec(function(err, sensorHistory) {
      callback(err,sensorHistory);
    });
  }
};



function read_sensor_history (req, res) {
  SensorHistoryManagement.findById(req.params.sensorId, function(err, sensorHistory) {
    if (sensorHistory == undefined || sensorHistory == null)
      res.status(404).json({message: 'WaterConsumptionHistory record Not found'});
    else if (err)
      res.send(err);
    else
      res.json(sensorHistory);
  });
};

function read_sensor_history_range (req, res) {
  SensorHistoryManagement.find({sensor_id: req.param('sensorId'), crop_user_id: req.param('cropUserId'), 
    creation_date: {$gte: req.param('start'), $lt:req.param('end')}}, function(err, sensorHistory) {
      if (sensorHistory == undefined || sensorHistory == null)
        res.status(404).json({message: 'read_sensor_history_range record Not found'});
      else if (err)
        res.send(err);
      else {
        res.json(sensorHistory);
      }
    }
  )
}

module.exports = {
  read_sensor_history_range: read_sensor_history_range,
  read_sensor_history: read_sensor_history,
  getSensorsHistory : getSensorsHistory,
  createSensorHistoryFromJson : createSensorHistoryFromJson,
  createSensorHistory : createSensorHistory
}