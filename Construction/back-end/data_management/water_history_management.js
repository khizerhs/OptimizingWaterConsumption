var mongoose = require('mongoose')
var schema = require('./schema')
var thingSpeak = require('../data_management/thing_speak')
var cropUserManagement = require('../data_management/crop_user_management')
var thingSpeak = require('../data_management/thing_speak')

var waterConsumptionHistory = schema.WaterConsumptionHistory
var queryCropUserId = cropUserManagement.queryCropUserId
var thingSpeakQueue = thingSpeak.thingSpeakQueue
var cb
var field4 = ''

exports.createWaterHistory = function (waterData, callback){
    cb = callback
    var data = JSON.parse(waterData)
    var cropUserId = queryCropUserId()
        
    if (null == cropUserId) {
        cb('[createWaterHistory] cropUserId undefined');
        return;
    }

    var waterHistoryManagement = createWaterHistoryManagement(data, cropUserId)
    
    if (null == waterHistoryManagement) {
        return;
    }

    waterHistoryManagement.save(function (err) {
        if (err) {
            cb(err)
        }
    });

    pushThingSpeakTask()
}

function createWaterHistoryManagement(data, cropUserId) {
    if (!data.w) {
        cb('[createWaterHistoryManagement] data.w does not exist')
        return null
    }

    field4 = 'field4=' + data.w.slice(0, data.w.length - 1);
    return new waterConsumptionHistory({crop_user_id : cropUserId, evatranspiration: "0", water_consumption:data.w})
}

function pushThingSpeakTask() {
    if ('' != field4) {
        var iotUrl = 'http://api.thingspeak.com/update?api_key=ORAYGP0SOPO0J1IB&' + field4
        // console.log(iotUrl)
        thingSpeakQueue.push(iotUrl)

        field4 = ''
    }
}