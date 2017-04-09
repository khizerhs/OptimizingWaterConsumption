var mongoose = require('mongoose');
var moment = require('moment-timezone');
var schema = require('./schema');
var common = require('./common');
var common = require('./common');
var cropUserManagement = require('../data_management/crop_user_management');
var queryCropUserId = cropUserManagement.queryCropUserId;
var MachineLearning = schema.MachineLearning;
var WeatherHistory = schema.WeatherHistory;


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

exports.createWeatherHistory = function(body,callback){
	var bayTime = common.getBayTime();
	body.creation_date = bayTime;
	body.crop_user_id = queryCropUserId();
	console.log("Weather data" +JSON.stringify(body));
	var weatherHistory = new WeatherHistory(body);
	weatherHistory.save(function(err) {
            callback(err);
    });
	
}

exports.getWeatherHistory = function(startDate,endDate,callback){
  console.log("Start date:"+startDate+" and endDate:"+endDate)
  WeatherHistory.findOne({
                 creation_date: {
                     $gte: startDate,
                     $lte: endDate
                 }
             }).exec(function(err, weatherHistory) {
             callback(err,weatherHistory);
     });
}

exports.weatherHistoryRange = function(req, res){
  WeatherHistory.find({crop_user_id: req.param('cropUserId'),
    creation_date: {$gte: req.param('start'), $lt:req.param('end')}}, function(err, weatherHistory) {
      if (weatherHistory == undefined || weatherHistory == null)
        res.status(404).json({message: 'weatherHistoryRange record not found'});
      else if (err)
        res.send(err);
      else {
        res.json(weatherHistory);
      }
    }
  )
}

