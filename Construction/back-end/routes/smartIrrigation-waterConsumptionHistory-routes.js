'use strict';
module.exports = function(app) {
  var smartIrrigation = require('../data_management/water_history_management');
  var user_application_logic = require('../logic/user_application_logic');

  
  app.route('/water-history')
    .get(function(req,res){
		var query = {
			start: req.param('start'),
			end : req.param('end')
		}
		smartIrrigation.list_wchs(query,function(err,wch){
			if (err)
			  res.send(err);
			else
			  res.json(wch);
		});
		
	});
	
	app.route('/water-history/total-consumption')
    .get(function(req,res){
		var query = {
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
	
	//(smartIrrigation.list_wchs);
    //.post(smartIrrigation.create_crop);


  app.route('/water-history/:cropUserId')
    .get(smartIrrigation.read_wch)
    .put(smartIrrigation.update_wch)
    .delete(smartIrrigation.delete_wch);

  app.route('/wh-date')
    .get(smartIrrigation.read_wch_date);
};
