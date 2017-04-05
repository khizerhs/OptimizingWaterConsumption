
module.exports = function(app) {
var weatherHistoryManagement = require('../data_management/weather_history_management');
var cropUserManagement = require('../data_management/crop_user_management');
var waterConsumptionPrediction = require('../logic/water_consumption_prediction_logic');
	app.route('/water-consumption-prediction/machine-learning')
    .post(function(req,res){
		weatherHistoryManagement.storeMachineLearningModel(req.body,function(err){
			if (err)
			  res.status(500).send(err);
			else
			  res.status(201).json({ message: 'Model created!' });
		});
		
	});
	app.route('/water-consumption-prediction/prediction')
    .get(function(req,res){
		var query = {
			crop_user_id: req.param('crop_user_id')
		}
		waterConsumptionPrediction.getWaterConsumptionPrediction(query,function(err,prediction){
			if (err)
                res.status(500).send(err.message);
			else
				res.status(200).json(prediction);
		});
		
	});
	
};