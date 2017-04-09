var mongoose = require('mongoose');
var moment = require('moment-timezone');
var schema = require('./schema');
var common = require('./common');
var common = require('./common');
var cropUserManagement = require('../data_management/crop_user_management');
var queryCropUserId = cropUserManagement.queryCropUserId;
var MachineLearning = schema.MachineLearning;
var waterConsumptionPrediction = schema.waterConsumptionPrediction;


exports.storeMachineLearningModel = function (body,callback){
	var bayTime = common.getBayTime();
	body.creation_date = bayTime;
	body.crop_user_id = queryCropUserId();
	var machineLearning = new MachineLearning(body);
    machineLearning.save(function(err) {
            callback(err);
    });
}

exports.getMachineLearningModel = function(callback){
	MachineLearning.findOne().sort({'_id': -1}).limit(1).exec(function(err, model) {
            callback(err,model);
    });
}

exports.createwaterConsumptionPrediction = function(body,callback){
	var bayTime = common.getBayTime();
	body.creation_date = bayTime;
	body.crop_user_id = queryCropUserId();
	console.log("Weather data" +JSON.stringify(body));
	var waterConsumptionPrediction = new waterConsumptionPrediction(body);
	waterConsumptionPrediction.save(function(err) {
            callback(err);
    });
	
}

exports.getwaterConsumptionPrediction = function(startDate,endDate,callback){
	console.log("Start date:"+startDate+" and endDate:"+endDate)
	waterConsumptionPrediction.findOne({
                creation_date: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).exec(function(err, waterConsumptionPrediction) {
            callback(err,waterConsumptionPrediction);
    });
}