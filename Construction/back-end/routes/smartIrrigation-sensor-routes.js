'use strict';
// Put MQTT consumer here temporary
var sensorHistoryManagement = require('../data_management/sensor_history_management')
var waterHistoryManagement = require('../data_management/water_history_management')
var common = require('../data_management/common')
var ws = require('../socket/smartIrrigation-websocket')

var mqtt = require('mqtt')
process.env.mqttconnectionstring = "mqtt://35.165.56.98:1883"
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
    /*.delete(smartIrrigation.delete_sensor)*/
};


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
    ws.ws_test(message.toString())
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
