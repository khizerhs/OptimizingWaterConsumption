'use strict';
// Put MQTT consumer here temporary
var sensorHistoryManagement = require('../data_management/sensor_history_management')
var waterHistoryManagement = require('../data_management/water_history_management')
var common = require('../data_management/common')

var mqtt = require('mqtt')
var client = mqtt.connect(process.env.mqttconnectionstring)

var topics = common.mqtt_topics

module.exports = function(app) {
  var smartIrrigation = require('../data_management/sensor_management');


  app.route('/sensors')
    .get(smartIrrigation.list_sensors)
    .post(smartIrrigation.create_sensor);


  app.route('/sensors/:sensorId')
    .get(smartIrrigation.read_sensor)
    .put(smartIrrigation.update_sensor)
    /*.delete(smartIrrigation.delete_sensor)*/;

  app.route('/sensors-history')
    .get(function(req,res){
      var query = {
        crop_user_id: req.param('crop_user_id')      
      }
      sensorHistoryManagement.getSensorsHistory(query,function(err,sensorsHistory){
        if (err)
          res.status(500).send(err.message);
        else
          res.status(200).json(sensorsHistory);
      });
      
    })
    .post(function(req,res){
      var query = {
        topic : req.param('topic'),
        value: req.param('value')      
      }
      sensorHistoryManagement.createSensorHistoryFromJson(query, function(err) {
          if (err)
            res.status(500).send(err.message);
          else
            res.status(200).json("Sensor history created succesfully");
      })
      
    });
};


client.on('connect', function () {
  console.log("Start mqtt")

  // subscribe topics
  for (var i = 0; i < topics.length; i++) {
    client.subscribe(topics[i])
  }
})

client.on('message', function (topic, message) {
  // get message from the subscribed topics

  if (topics[3] == topic) {
    waterHistoryManagement.createWaterHistory(message.toString(), function(err) {
      console.log("MQTT createWaterHistory error");
      console.log(err);
    })
  } else {
    sensorHistoryManagement.createSensorHistory(topic.toString(), message.toString(), function(err) {
      console.log("MQTT createSensorHistory error");
      console.log(err);
    })
  }
})
