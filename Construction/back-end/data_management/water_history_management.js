var mongoose = require('mongoose');
var moment = require('moment-timezone');
var schema = require('./schema');
var thingSpeak = require('../data_management/thing_speak');
var cropUserManagement = require('../data_management/crop_user_management');
var thingSpeak = require('../data_management/thing_speak');
var common = require('./common');
var waterConsumptionHistory = schema.WaterConsumptionHistory;
var queryCropUserId = cropUserManagement.queryCropUserId;
var field4Queue = thingSpeak.field4Queue;
var cb;

exports.createWaterHistory = function (waterData, callback){
    cb = callback;
    var data = JSON.parse(waterData);
    var cropUserId = queryCropUserId();
        
    if (null == cropUserId) {
        cb('[createWaterHistory] cropUserId undefined');
        return;
    }

    var waterHistoryManagement = createWaterHistoryManagement(data, cropUserId);
    
    if (null == waterHistoryManagement) {
        return;
    }

    waterHistoryManagement.save(function (err) {
        if (err) {
            cb(err);
        }
    });
}

function createWaterHistoryManagement(data, cropUserId) {
	
    if (!data.w) {
        cb('[createWaterHistoryManagement] data.w does not exist')
        return null;
    }
	var bayTime = common.getBayTime();
    var field4 = 'field4=' + data.w;
    field4Queue.push(field4);
    return new waterConsumptionHistory({crop_user_id : cropUserId, evatranspiration: "0", water_consumption:data.w, creation_date:bayTime});
}


// WaterConsumptionHistory REST API

exports.list_wchs = function(req, res) {
  waterConsumptionHistory.find({}, function(err, wch) {
    if (err)
      res.send(err);
    else
      res.json(wch);
  });
};



exports.read_wch = function(req, res) {
  waterConsumptionHistory.findById(req.params.cropUserId, function(err, wch) {
    if (wch == undefined || wch == null)
      res.status(404).json({message: 'WaterConsumptionHistory record Not found'});
    else if (err)
      res.send(err);
    else
      res.json(wch);
  });
};


exports.update_wch = function(req, res) {
  waterConsumptionHistory.findOneAndUpdate(req.params.cropUserId, req.body, {new: true}, function(err, wch) {
    if (wch == undefined || wch == null)
      res.status(404).json({message: 'WaterConsumptionHistory Record is Not found'});
    else if (err)
      res.status(400).json(err);
    else    
      res.json(wch);
  });
};


exports.delete_wch = function(req, res) {
  waterConsumptionHistory.remove({
    _id: req.params.cropUserId
  }, function(err, wch) {
    if (err)
      res.status(400).json(err);
    else
      res.json({ message: 'Record successfully deleted' });
  });
};


exports.read_wch_date = function(req, res){
if(req.query.end == undefined || req.query.end == null){
	waterConsumptionHistory.find({
    creation_date: {
        $gte: moment(req.query.start, 'MM-DD-YYYY').format()
	}
    }, function(err, wch) {
    if (err)
      res.send(err);
    else
      res.json(wch);
  });
}
else{
waterConsumptionHistory.find({
    creation_date: {
        	$gte: moment(req.query.start, 'MM-DD-YYYY').tz('America/Los_Angeles').format(),
       		$lt: moment(req.query.end, 'MM-DD-YYYY').tz('America/Los_Angeles').format()
	}
    }, function(err, wch) {
    if (err)
      res.send(err);
    else
      res.json(wch);
  });

}

};



