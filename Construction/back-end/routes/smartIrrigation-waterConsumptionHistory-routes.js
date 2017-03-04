'use strict';
module.exports = function(app) {
  var smartIrrigation = require('../data_management/water_history_management');


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
	
	(smartIrrigation.list_wchs);
    //.post(smartIrrigation.create_crop);


  app.route('/water-history/:cropUserId')
    .get(smartIrrigation.read_wch)
    .put(smartIrrigation.update_wch)
    .delete(smartIrrigation.delete_wch);

  app.route('/wh-date')
    .get(smartIrrigation.read_wch_date);
};
