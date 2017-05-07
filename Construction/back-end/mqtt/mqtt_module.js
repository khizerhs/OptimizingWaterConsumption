'use strict';
// Put MQTT consumer here temporary
var sensorHistoryManagement = require('../data_management/sensor_history_management')
var waterHistoryManagement = require('../data_management/water_history_management')
var common = require('../data_management/common')

var mqtt = require('mqtt')
process.env.mqttconnectionstring = "mqtt://35.163.200.173:1883"
var client = mqtt.connect(process.env.mqttconnectionstring)

exports.mqtt_client = client

var topics = common.mqtt_topics

client.on('connect', function () {
  console.log("Start mqtt")

  // subscribe topics
  for (var i = 0; i < topics.length; i++) {
    client.subscribe(topics[i])
  }

  client.subscribe('websocket_test')
})

client.on('message', function (topic, message) {
  // get message from the subscribed topics

  if (topics[3] == topic) {
    console.log("Water received");
    var query = {
        value: message.toString()      
    }
    waterHistoryManagement.createWaterHistory(query, function(err) {
        if(err){
          console.log(err);
        }else
          console.log("MQTT sensor history created on topic: "+topic.toString());
    })
  } else if ('websocket_test' == topic) {
    console.log('websocket_test')
    waterHistoryManagement.ws_test(message.toString())
  }else {
    console.log("Sensor received");
    sensorHistoryManagement.createSensorHistory(null,topic.toString(), message.toString(), function(err) {
      if(err){
        console.log(err);
      }else
        console.log("MQTT sensor history created on topic: "+topic.toString());
    })
  }
})
