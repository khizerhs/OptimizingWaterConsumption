
var water_history_management = require('../data_management/water_history_management');


exports.getTotalWaterConsumption = function(query, callback){
	water_history_management.list_wchs(query,function(err,wch_list){
			if (err)
			  callback(err);
			else{
				callback(err,calculaterWaterConsumption(wch_list));
			}
			  
	});
}

function calculaterWaterConsumption(wch_list){
	var water_consumption = 0;
	for(var i = 0; i < wch_list.length; i++) {
		var wch = wch_list[i];
		water_consumption += Number(wch.water_consumption);
		
	}
	return water_consumption;
	
}