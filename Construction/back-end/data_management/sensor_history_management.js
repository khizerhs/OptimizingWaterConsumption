var mongoose = require('mongoose');
var schema = require('./schema');
var request = require('request');

var SensorHistoryManagement = schema.SensorHistory;
var field1 = '', field2 = '', field3 = ''
var topics = ['arduino-temp', 'arduino-hum', 'arduino-soil', 'arduino-water']
var cb

exports.createSensorHistory = function (sensorType, sensorData, callback){
    // console.log('createSensorHistory')
    // console.log(sensorType)
    // console.log(sensorData)
    cb = callback
    var data = JSON.parse(sensorData)
    var sensorId = querySensorId(sensorType), cropUserId = queryCropUserId()
        
    if (null == sensorId) {
        cb('sensorId undefined')
        return;
    }

    if (null == cropUserId) {
        cb('cropUserId undefined');
        return;
    }

    var sensorHistoryManagement = createSensorHistoryManagement(sensorType, data, sensorId, cropUserId, callback)
    
    if (null == sensorHistoryManagement) {
        return;
    }

    sensorHistoryManagement.save(function (err) {
        if (err) {
            cb(err)
        } else {
            updateThingSpeak()
        }
    });
}

function createSensorHistoryManagement(sensorType, data, sensorId, cropUserId) {
    switch (sensorType) {
        case topics[0]:
            if (!data.t) {
                cb('[createSensorHistoryManagement] data.temp does not exist')
                return null
            }

            field2 = 'field2=' + data.t.slice(0, data.t.length - 1);
            return new SensorHistoryManagement({sensor_id:sensorId, crop_user_id:cropUserId, value:data.t});

        case topics[1]:
            if (!data.h) {
                cb('[createSensorHistoryManagement] data.hum does not exist')
                return null
            }

            field1 = 'field1=' + data.h.slice(0, data.h.length - 1);;
            return new SensorHistoryManagement({sensor_id:sensorId, crop_user_id:cropUserId, value:data.h});

        case topics[2]:
            if (!data.s) {
                cb('[createSensorHistoryManagement] data.soil does not exist')
                return null
            }

            field3 = 'field3=' + data.s.slice(0, data.s.length - 1);;
            return new SensorHistoryManagement({sensor_id:sensorId, crop_user_id:cropUserId, value:data.s});
        
        default:
            cb('[exports.createSensorHistoryManagement] ' + sensorType + ' undefined');
            return null
    }
}

function queryCropUserId() {
    return mongoose.Types.ObjectId("589d54a5055013627647c9e7")
}

function querySensorId(sensorType) {
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

function updateThingSpeak() {
    if ('' != field1 && '' != field2 && '' != field3) {
        var iotUrl = 'http://api.thingspeak.com/update?api_key=ORAYGP0SOPO0J1IB&' + field1 + '&' + field2 + '&' + field3
        // console.log(iotUrl)

        request.post(iotUrl, function (err, response, body) {
        // console.log('IOT return status code:' + response.statusCode)
            if (err) {
                cb(err)
            }
        });

        field1 = ''
        field2 = ''
        field3 = ''
    }
}