
module.exports = function(app) {
var weatherHistoryManagement = require('../data_management/weather_history_management');

	app.route('/weather_history/machine_learning')
    .post(function(req,res){
		weatherHistoryManagement.storeMachineLearningModel(req.body,function(err){
			if (err)
			  res.status(500).send(err);
			else
			  res.status(201).json({ message: 'Model created!' });
		});
		
	});

    app.route('/weather-history-range')
    .get(weatherHistoryManagement.weatherHistoryRange);
};