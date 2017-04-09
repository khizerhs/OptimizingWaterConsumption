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

exports.getMachineLearningModel = function(callback){
	MachineLearning.findOne().sort({'_id': -1}).limit(1).exec(function(err, model) {
            callback(err,model);
    });
}

exports.createWaterConsumptionPrediction = function(body,callback){
	var bayTime = common.getBayTime();
	body.creation_date = bayTime;
	body.crop_user_id = queryCropUserId();
	console.log("Weather data" +JSON.stringify(body));
	var WaterConsumptionPrediction = new WaterConsumptionPrediction(body);
	WaterConsumptionPrediction.save(function(err) {
            callback(err);
    });
	
}


exports.getWaterConsumptionPrediction = function(req, res){
	WaterConsumptionPrediction.find({crop_user_id: req.param('cropUserId'),
    creation_date: {$gte: req.param('start'), $lt:req.param('end')}}, function(err, WaterConsumptionPrediction) {
      if (WaterConsumptionPrediction == undefined || WaterConsumptionPrediction == null)
        res.status(404).json({message: 'getWaterConsumptionPrediction record Not found'});
      else if (err)
        res.send(err);
      else {
        res.json(WaterConsumptionPrediction);
      }
    }
  )
}