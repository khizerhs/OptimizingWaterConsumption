var mongoose = require('mongoose');
var moment = require('moment-timezone');
var schema = require('./schema');
var thingSpeak = require('../data_management/thing_speak');
var cropUserManagement = require('../data_management/crop_user_management');
var common = require('./common');
var ws_emit = require('../socket/smartIrrigation-websocket').emit_ws;
var waterConsumptionHistory = schema.WaterConsumptionHistory;
var queryCropUserId = cropUserManagement.queryCropUserId;
var field4Queue = thingSpeak.field4Queue;
var cb;
var last_water_update_time = null;
var water_update_diff = 60000 //60000 is 1 min

exports.createWaterHistory = function (query, callback){
    cb = callback;
    var cropUserId = query.crop_user_id
    if(cropUserId == null || cropUserId == null){
      cropUserId = queryCropUserId();
    }
    if (null == cropUserId) {
        return cb(new Error('[createWaterHistory] cropUserId undefined'));
        
    }

    createWaterHistoryManagement(query.value, cropUserId, function(err, waterHistoryManagement){
      if (err)
        return callback(err)
  
      waterHistoryManagement.save(callback);
    });
    
}

function createWaterHistoryManagement(data, cropUserId, callback) {
	
  if (!data || 0 === data.length) {
      callback(new Error('[createWaterHistoryManagement] water consumption got empty string'));
  }

	var bayTime = common.getBayTime();
  
  // Remove duplicate message since water consumption doesn't update within 1 min
  if (null != last_water_update_time && 
    bayTime - last_water_update_time <= water_update_diff) {
    
    console.log('[createWaterHistoryManagement]: timestamp difference shorter than ' + parseInt(water_update_diff))
    var diff = bayTime - last_water_update_time
    console.log('Diff: ' + diff)
    
    return callback(new Error('[createWaterHistoryManagement]: timestamp difference shorter than ' + parseInt(water_update_diff))
  }

  console.log('[createWaterHistoryManagement]: save water history: ' + data)
  last_water_update_time = bayTime
  
  var field4 = 'field4=' + data;
  field4Queue.push(field4);
  callback(null, new waterConsumptionHistory({crop_user_id : cropUserId, evatranspiration: "0", water_consumption:data, creation_date:bayTime}));
}



exports.list_wchs = function(query, callback) {
  var time_offset = -7 * 60 * 60 * 1000
  if(JSON.stringify(query) == '{}'){
	  console.log("No params");
	  waterConsumptionHistory.find({}, function(err, wch) {
		if (err)
		  callback(err,null);
		else
		  callback(null,wch);
	  });
  }else{
	  
	  if(query.end == undefined || query.end == null){
		waterConsumptionHistory.find({crop_user_id: query.cropUserId,
			creation_date: {
				$gte: moment(query.start, 'MM-DD-YYYY HH:mm').tz('America/Los_Angeles').format()
			}
			}, function(err, wch) {
			if (err)
			  callback(err,null);
			else
			  callback(err,wch);
		});
	  }else{
		  console.log("Date begin: "+moment(query.start, 'MM-DD-YYYY HH:mm').tz('America/Los_Angeles').format())
		  console.log("Date end: "+moment(query.end, 'MM-DD-YYYY HH:mm').tz('America/Los_Angeles').format())
		  waterConsumptionHistory.find({crop_user_id: query.cropUserId,
			creation_date: {
					$gte: moment(query.start, 'MM-DD-YYYY HH:mm').tz('America/Los_Angeles').format(),
					$lt: moment(query.end, 'MM-DD-YYYY HH:mm').tz('America/Los_Angeles').format()
			}
			}, function(err, wch) {
			if (err)
			  callback(err,null);
			else
			  callback(err,wch);
		});
	  }
  }
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

/*
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
*/

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

exports.ws_test = function(message) {
  console.log('exports.ws_test')
  ws_emit(queryCropUserId(), message)
}
