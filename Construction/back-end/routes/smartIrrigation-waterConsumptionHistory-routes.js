'use strict';
module.exports = function(app) {
  var waterHistoryManagement = require('../data_management/water_history_management');
  var user_application_logic = require('../logic/user_application_logic');

  
  app.route('/water-history')
    .get(function(req,res){
		var query = {
            cropUserId: req.param('cropUserId'),
			start: req.param('start'),
			end : req.param('end')
		}
		waterHistoryManagement.list_wchs(query,function(err,wch){
			if (err)
			  res.send(err);
			else
			  res.json(wch);
		});
		
	})
	.post(function(req,res){
	  var query = {
      	crop_user_id : req.param('crop_user_id'),
        value: req.param('value')      
      }
      waterHistoryManagement.createWaterHistory(query, function(err){
          if (err)
            res.status(500).send(err.message);
          else
            res.status(201).json("Water history created succesfully");
      })
      
    });
	
	app.route('/water-history/total-consumption')
    .get(function(req,res){
		var query = {
            cropUserId: req.param('cropUserId'),
			start: req.param('start'),
			end : req.param('end')
		}
		user_application_logic.getTotalWaterConsumption(query,function(err,total){
			if (err)
			  res.status(500).send(err);
			else
			  res.status(200).json(total);
		});
		
	});
	
	//(waterHistoryManagement.list_wchs);
    //.post(waterHistoryManagement.create_crop);


  app.route('/water-history/:cropUserId')
    .get(waterHistoryManagement.read_wch)
    .put(waterHistoryManagement.update_wch)
    /*.delete(waterHistoryManagement.delete_wch)*/;

  app.route('/wh-date')
    .get(waterHistoryManagement.read_wch_date);
};
