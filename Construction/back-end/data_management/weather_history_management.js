var mongoose = require('mongoose');
var moment = require('moment-timezone');
var schema = require('./schema');
var common = require('./common');
var common = require('./common');
var cropUserManagement = require('../data_management/crop_user_management');
var queryCropUserId = cropUserManagement.queryCropUserId;
var MachineLearning = schema.machineLearning;


exports.storeMachineLearningModel = function (body,callback){
	var bayTime = common.getBayTime();
	body.creation_date = bayTime;
	body.crop_user_id = queryCropUserId();
	var machineLearning = new MachineLearning(body);
    machineLearning.save(function(err) {
            callback(err);
    });
}