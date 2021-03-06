
module.exports = function(app) {
var waterConsumptionPredictionManagement = require('../data_management/water_consumption_prediction_management');
var cropUserManagement = require('../data_management/crop_user_management');
var waterConsumptionPrediction = require('../logic/water_consumption_prediction_logic');
	app.route('/water-consumption-prediction/machine-learning')
    .post(function(req,res){
		waterConsumptionPredictionManagement.storeMachineLearningModel(req.body,function(err){
			if (err)
			  res.status(500).send(err);
			else
			  res.status(201).json({ message: 'Model created!' });
		});
		
	});
	app.route('/water-consumption-prediction/prediction')
    .get(function(req,res){
		var query = {
			crop_user_id: req.param('crop_user_id'),
			date : req.param('date')			
		}
		waterConsumptionPrediction.getWaterConsumptionPrediction(query,function(err,prediction){
			if (err)
                res.status(500).send(err.message);
			else
				res.status(200).json(prediction);
		});
		
	});

	app.route('/water-consumption-prediction/predictionByRange')
    .get(function(req,res){
		var query = {
			crop_user_id: req.param('crop_user_id'),
			start_date : req.param('start_date'),
			end_date : req.param('end_date')
		}
		console.log("Received"+query);
		waterConsumptionPrediction.getWaterConsumptionPredictionByRange(query, function(err,predictions){
			if (err)
                res.status(500).send(err.message);
			else
				res.status(200).json(predictions);
		});
		
	});
	
};