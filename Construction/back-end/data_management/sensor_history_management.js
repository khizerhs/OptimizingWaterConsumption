var mongoose = require('mongoose')
var schema = require('./schema')
var cropUserManagement = require('../data_management/crop_user_management')
var sensorManagement = require('../data_management/sensor_management')
var thingSpeak = require('../data_management/thing_speak')
var commonVariables = require('./common_variables')

var SensorHistoryManagement = schema.SensorHistory
var queryCropUserId = cropUserManagement.queryCropUserId
var querySensorId = sensorManagement.querySensorId
var field1 = '', field2 = '', field3 = ''
var cb
var thingSpeakQueue = thingSpeak.thingSpeakQueue
var topics = commonVariables.mqtt_topics

exports.createSensorHistory = function(sensorType, sensorData, callback) {
    // console.log('createSensorHistory')
    // console.log(sensorType)
    // console.log(sensorData)
    cb = callback
    var data = JSON.parse(sensorData)
    var sensorId = querySensorId(sensorType), cropUserId = queryCropUserId()

    if (null == sensorId) {
        cb('[createSensorHistory] sensorId undefined')
        return
    }

    if (null == cropUserId) {
        cb('[createSensorHistory] cropUserId undefined')
        return
    }

    var sensorHistoryManagement = createSensorHistoryManagement(sensorType, data, sensorId, cropUserId)
    
    if (null == sensorHistoryManagement) {
        return
    }

    sensorHistoryManagement.save(function(err) {
        if (err) {
            cb(err)
        } 
    })

    pushThingSpeakTask()
}

function createSensorHistoryManagement(sensorType, data, sensorId, cropUserId) {
    switch (sensorType) {
        case topics[0]:
            if (!data.t) {
                cb('[createSensorHistoryManagement] data.t does not exist')
                return null
            }

            field2 = 'field2=' + data.t.slice(0, data.t.length - 1)
            return new SensorHistoryManagement({sensor_id:sensorId, crop_user_id:cropUserId, value:data.t});

        case topics[1]:
            if (!data.h) {
                cb('[createSensorHistoryManagement] data.h does not exist')
                return null
            }

            field1 = 'field1=' + data.h.slice(0, data.h.length - 1)
            return new SensorHistoryManagement({sensor_id:sensorId, crop_user_id:cropUserId, value:data.h});

        case topics[2]:
            if (!data.s) {
                cb('[createSensorHistoryManagement] data.s does not exist')
                return null
            }

            field3 = 'field3=' + data.s.slice(0, data.s.length - 1)
            return new SensorHistoryManagement({sensor_id:sensorId, crop_user_id:cropUserId, value:data.s});
        
        default:
            cb('[exports.createSensorHistoryManagement] ' + sensorType + ' undefined');
            return null
    }
}

function pushThingSpeakTask() {
    if ('' != field1 && '' != field2 && '' != field3) {
        var iotUrl = 'http://api.thingspeak.com/update?api_key=ORAYGP0SOPO0J1IB&' + field1 + '&' + field2 + '&' + field3
        // console.log(iotUrl)
        thingSpeakQueue.push(iotUrl)

        field1 = ''
        field2 = ''
        field3 = ''
    }
}