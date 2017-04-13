var mongoose = require('mongoose');
var moment = require('moment-timezone');
var schema = require('./schema');
var common = require('./common');
var common = require('./common');
var cropUserManagement = require('../data_management/crop_user_management');
var queryCropUserId = cropUserManagement.queryCropUserId;
var MachineLearning = schema.MachineLearning;
var WaterConsumptionPrediction = schema.WaterConsumptionPrediction;


exports.storeMachineLearningModel = function (body,callback){
	var bayTime = common.getBayTime();
	body.creation_date = bayTime;
	body.crop_user_id = queryCropUserId();
	var machineLearning = new MachineLearning(body);
    machineLearning.save(function(err) {
            callback(err);
    });
}

exports.getMachineLearningModel = function(query,callback){
	MachineLearning.findOne(query).sort({'_id': -1}).exec(function(err, model) {
            callback(err,model);
    });
}

exports.createWaterConsumptionPrediction = function(body,callback){
	var bayTime = common.getBayTime();
	body.creation_date = bayTime;
	body.crop_user_id = queryCropUserId();
	console.log("Weather data" +JSON.stringify(body));
	var waterConsumptionPrediction = new WaterConsumptionPrediction(body);
	waterConsumptionPrediction.save(function(err) {
            callback(err);
    });
}


exports.getWaterConsumptionPredictionHistory = function(startDate,endDate,callback){
  console.log("Start date:"+startDate+" and endDate:"+endDate)
  WaterConsumptionPrediction.find({
                 date_prediction: {
                     $gte: startDate,
                     $lte: endDate
                 }
             }).sort({date_prediction : 1}).exec(function(err, weatherHistory) {
             callback(err,weatherHistory);
     });
}

