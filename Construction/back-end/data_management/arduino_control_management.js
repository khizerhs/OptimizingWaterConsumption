var mongoose = require('mongoose');
var schema = require('./schema');
var common = require('./common');
var cropUserManagement = require('../data_management/crop_user_management');
var ArduinoControl = schema.ArduinoControl;


exports.getArduinoControl = function (query, callback){
	if(query.crop_user_id == null || query.crop_user_id == undefined){
		query.crop_user_id = cropUserManagement.queryCropUserId();
	}
	ArduinoControl.findOne(query, function(err, arduinoControl) {
      callback(err,arduinoControl);
    });
}

exports.createArduinoControl = function (body,callback){
	var bayTime = common.getBayTime();
	body.creation_date = bayTime;
	var arduinoControl = new ArduinoControl(body);
    arduinoControl.save(function(err) {
            callback(err);
    });
}

exports.updateArduinoControl = function (query, conditions,callback){
	//console.log("User body: "+JSON.stringify(conditions));
	ArduinoControl.findOne(query,function(err,arduinoControl){
		
		if(err)
			return callback(err,null);
		
		if(arduinoControl == null)
			return callback(new Error("ArduinoControl not found"),null );
		
		for (var key in conditions){
			
			
			//console.log("Conditions: "+JSON.stringify(conditions));
			//console.log("key: "+key);
			//console.log("User: "+JSON.stringify(user));
			//console.log("User key: "+user[key]);
			if(arduinoControl[key] != null){
				console.log("ArduinoControl key exist");
				arduinoControl[key] = conditions[key];
			}else{
				console.log("ArduinoControl key does not exist");
				arduinoControl[key] = conditions[key];
			}
		}
		
		
		arduinoControl.save(callback)
	
	});
}