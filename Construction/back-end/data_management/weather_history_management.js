var mongoose = require('mongoose');
var moment = require('moment-timezone');
var schema = require('./schema');
var common = require('./common');
var common = require('./common');
var cropUserManagement = require('../data_management/crop_user_management');
var queryCropUserId = cropUserManagement.queryCropUserId;
var MachineLearning = schema.MachineLearning;
var weatherHistory = schema.weatherHistory;

exports.createweatherHistory = function(body,callback){
	var bayTime = common.getBayTime();
	body.creation_date = bayTime;
	body.crop_user_id = queryCropUserId();
	console.log("Weather data" +JSON.stringify(body));
	var weatherHistory = new weatherHistory(body);
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


