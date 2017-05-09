var math = require('mathjs');
var request=require('request');
var Client = require('node-rest-client').Client;
var CronJob = require('cron').CronJob;
var moment = require('moment-timezone');
var client = new Client();

var waterConsumptionPredictionManagement = require('../data_management/water_consumption_prediction_management');
var weatherHistoryManagement = require('../data_management/weather_history_management');
var cropUserManagement = require('../data_management/crop_user_management');
var sun_rhours,sun_rmin,getWeather;

var getSunR = new CronJob({
  cronTime: '00 00 00 * * *',
  onTick: getSunRiseInfo,
  start: false,
  timeZone: 'America/Los_Angeles'
});
getSunR.start();

var job = new CronJob({
  cronTime: '00 00 17 * * *',
  onTick: calculateWaterConsumptionPrediction(),
  start: false,
  timeZone: 'America/Los_Angeles'
});
job.start();

var getWeatherHistory = new CronJob({
  cronTime: '00 05 00 * * *',
  onTick: storeWeatherHistory,
  start: false,
  timeZone: 'America/Los_Angeles'
});
getWeatherHistory.start();


function calculateWaterConsumptionPrediction(){
	console.log("Calculating daily water consumption prediction")
	crop_user_id = cropUserManagement.queryCropUserId();
	var now = moment(new Date()).tz('America/Los_Angeles').format('YYYY-MM-DD');
	getWaterConsumptionPrediction({crop_user_id: crop_user_id, date:now}, function(err,prediction){
		if(!err)
			console.log("Prediction: "+JSON.stringify(prediction))
	})

}

function storeWeatherHistory(){
	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	callCimisApi(yesterday, function(err,data){
		if(err){
			console.log("Could not populate weather data");
		}
		else{
			var nnow = new Date();
	nnow.setDate(nnow.getDate() - 1);
	var now = moment(nnow).format('YYYY-MM-DD');
    console.log(now);
	client.get("http://et.water.ca.gov/api/data?appKey=95213f45-359b-4397-a6c3-d6bf33ced5f3&targets=211&startDate="+now+"&endDate="+now+"&dataItems=hly-precip,hly-net-rad,hly-air-tmp,hly-vap-pres,hly-rel-hum,hly-dew-pnt,hly-wind-spd,hly-wind-dir,hly-soil-tmp", function(data,response){
		//console.log("Response"+JSON.stringify(data))
		var history=data.Data.Providers[0].Records;
		for(var i=0;i<1;i++){
			var weatherRecord={
			  zipcode : history[i].ZipCodes,
			  precipitation : history[i].HlyPrecip.Value,
			  solar_radiation:history[i].HlyNetRad.Value,
			  vapor_pressure:history[i].HlyVapPres.Value,
			  air_temperature:history[i].HlyAirTmp.Value,
			  relative_humidity:history[i].HlyRelHum.Value,
			  dew_point:history[i].HlyDewPnt.Value,
			  wind_speed:history[i].HlyWindSpd.Value,
			  wind_direction: history[i].HlyWindDir.Value,
			  soil_temperature: history[i].HlySoilTmp.Value,
			  hour : history[i].Hour
			}
		weatherHistoryManagement.createweatherHistory(weatherRecord,function(err){
			if(err){console.log("Error occured populating weather history data");}
			});
		}
	});	
		}
});
}

function getSunRiseInfo(){	
    client.get("http://api.wunderground.com/api/90e662793af1aa07/conditions/astronomy/q/CA/San_Jose.json", function (data, response) {
    sun_rhours=data.sun_phase.sunrise.hour;
    sun_rmin=data.sun_phase.sunrise.minute;
    console.log("Sunrise info collected which is "+sun_rhours+":"+sun_rmin);
    getWeather = new CronJob({
        cronTime: "00 00 "+(parseInt(sun_rhours)+1)+' * * *',
        onTick: getWeatherInfo,
        start: false,
        timeZone: 'America/Los_Angeles'
    });
    getWeather.start();
    console.log("getWeatherinfo cron job running:"+getWeather.running);
});
}

function getWeatherInfo (date, callback){
    
	var now = moment(date).format('YYYY-MM-DD');
    console.log(now);
	
   callCimisApi(now, function(err,data){
        //console.log("Response"+JSON.stringify(data));

		if(err || data == null || his == null){
			console.log("Getting data from yesterday")
			var yesterday = moment(date).subtract(1, 'day').format('YYYY-MM-DD');
			console.log(yesterday);
			callCimisApi(yesterday, function(err,data){
				if(err)
					return callback(err,null );
				records=data.Data.Providers[0].Records;
				//Peak hour or the hottest time during the day is at three p.m. during the day
				var his = records[14];
				//console.log(JSON.stringify(his));
				//console.log(JSON.stringify(his));
				var weatherRecord={
				  precipitation : his.HlyPrecip.Value,
				  solar_radiation:his.HlyNetRad.Value,
				  vapor_pressure:his.HlyVapPres.Value,
				  air_temperature:his.HlyAirTmp.Value,
				  relative_humidity:his.HlyRelHum.Value,
				  dew_point:his.HlyDewPnt.Value,
				  wind_speed:his.HlyWindSpd.Value,
				  wind_direction: his.HlyWindDir.Value,
				  soil_temperature: his.HlySoilTmp.Value
				}
				callback(err,weatherRecord)
			})
		}else{
			var records=data.Data.Providers[0].Records;
			//Peak hour or the hottest time during the day is at three p.m. during the day
			var his = records[14];
			//console.log("Data"+JSON.stringify(his));
			var weatherRecord={
			  precipitation : his.HlyPrecip.Value,
			  solar_radiation:his.HlyNetRad.Value,
			  vapor_pressure:his.HlyVapPres.Value,
			  air_temperature:his.HlyAirTmp.Value,
			  relative_humidity:his.HlyRelHum.Value,
			  dew_point:his.HlyDewPnt.Value,
			  wind_speed:his.HlyWindSpd.Value,
			  wind_direction: his.HlyWindDir.Value,
			  soil_temperature: his.HlySoilTmp.Value
			}
			callback(err,weatherRecord)
		};
		
		
    });
}

function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
        dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
}

var getWaterConsumptionPredictionByRange = function (query,callback){
	var date = new Date(query.start_date);
	var startDate = moment(new Date(query.start_date))
    .set({ hour: 0, minute: 0 });
	var endDate = moment(new Date(query.end_date))
    .set({ hour: 23, minute: 59 });
    var predictions = [];

    cropUserManagement.getCropUser({_id : query.crop_user_id}, function(err,cropUser){
	    	if(err)
	    		callback(err,null)
	    	else{
				waterConsumptionPredictionManagement.getWaterConsumptionPredictionHistory(startDate.toDate(),endDate.toDate(),function(err,weatherHistory){
					
					for(var index in weatherHistory){					
						var predictionToLitersInOneDay = (weatherHistory[index].water_consumption_predicted/cropUser.acreage)/0.035315*cropUser.field_size*24
						predictionToLitersInOneDay *= 1000 //convert to mililiters
						predictions.push({prediction : predictionToLitersInOneDay, date : weatherHistory[index].date_prediction});
					}
					callback(null, predictions)
				})
			}
		})
	
}

//Method that calculates the future water water consumption
function getWaterConsumptionPrediction (query,callback){
	var date = new Date(query.date);
	var startDate = moment(date)
    .set({ hour: 0, minute: 0 });
	var endDate = moment(date)
    .set({ hour: 23, minute: 59 });

	waterConsumptionPredictionManagement.getWaterConsumptionPredictionHistory(startDate.toDate(),endDate.toDate(),function(err,weatherHistory){
		if(err)
			callback(err,null)
		else if(weatherHistory == undefined || weatherHistory.length == 0){
			getWeatherInfo(date, function(err,weather_data){		
				//console.log("Weather data"+JSON.stringify(weather_data));
				if(err)
					return callback(err,null);

				cropUserManagement.getCropUser({_id : query.crop_user_id}, function(err,cropUser){
					if(err)
						return callback(err,null)
					waterConsumptionPredictionManagement.getMachineLearningModel({crop_user_id : crop_user_id},function(err,model){		
						
						if(err)
							callback(err,null);
						else{
							console.log("Model: "+JSON.stringify(model));
							var coeffs = model.coeffs.split(",").map(Number);
							var scale = model.features_scale.split(",").map(Number);
							var data_max = model.data_max.split(",").map(Number);
							var data_min = model.data_min.split(",").map(Number);
							
							var weather_record = [];
							for(var key in weather_data){	 
								weather_record.push(weather_data[key]);
							}
							
							//Include acreage into the weather_record
							weather_record.unshift(cropUser.acreage)
							//weather_record = weather_record.slice(2,weather_record.length);
							//console.log("Weather data: "+weather_record);
							//console.log("Data min: "+data_min);
							//console.log("Data max: "+data_max);
							var numerator = math.subtract(weather_record,data_min);
							var denominator = math.subtract(data_max,data_min);

							var weather_record_scaled = math.dotDivide(numerator,denominator);
							console.log("Weather record scaled: ",weather_record_scaled.toString());

							var prediction = math.dotMultiply(coeffs,weather_record_scaled);
							//var prediction = math.dotMultiply(coeffs,scale);
							//prediction = math.dotMultiply(prediction,weather_record)
							console.log("Prediction vector: "+prediction);
							var prediction = math.sum(prediction)
							console.log("Prediction result" +prediction);
							
							weather_data.water_consumption_predicted = prediction.toString()
							weather_data.date_prediction = date;
							
							waterConsumptionPredictionManagement.createWaterConsumptionPrediction(weather_data,function(err){
								if(err)
										return callback(err,null)
								//Conversion of ccf to liters
								predictionToLitersInOneDay = prediction*2831.68/cropUser.acreage*cropUser.field_size*24

								//Return the prediction in liters in one day
								console.log(JSON.stringify(cropUser))
								//Conversion of cubic feet to liters
								//predictionToLitersInOneDay = (prediction/cropUser.acreage)/0.035315*cropUser.field_size*24
								predictionToLitersInOneDay *= 1000 //convert to mililiters
								callback(err,{prediction : predictionToLitersInOneDay});
																	
								
							})
						}
						
					})

				})
			
			})
		}else{
			console.log("Weather history found");
			cropUserManagement.getCropUser({_id : query.crop_user_id}, function(err,cropUser){
				if(err)
					callback(err,null)
				else{
					//Return the prediction in liters in one day
					console.log(JSON.stringify(cropUser))
					console.log(JSON.stringify(weatherHistory))
					//Conversion of ccf to liters
					predictionToLitersInOneDay = prediction*2831.68/cropUser.acreage*cropUser.field_size*24
					//Conversion of cubic feet to liters
					//predictionToLitersInOneDay = (weatherHistory[0].water_consumption_predicted/cropUser.acreage)/0.035315*cropUser.field_size*24
					predictionToLitersInOneDay *= 1000 //convert to mililiters
					callback(err,{prediction : predictionToLitersInOneDay});
				}
			})
		}
	
	})
}



function callCimisApi(now,callback){
    client.get("http://et.water.ca.gov/api/data?appKey=95213f45-359b-4397-a6c3-d6bf33ced5f3&targets=211&startDate="+now+"&endDate="+now+"&dataItems=hly-precip,hly-net-rad,hly-air-tmp,hly-vap-pres,hly-rel-hum,hly-dew-pnt,hly-wind-spd,hly-wind-dir,hly-soil-tmp", function(data,response){
		//console.log("Response"+JSON.stringify(data))
		if(data == 'undefined')
			return callback(new Error("Weather station data not provided"),null );
		else if(typeof data.Data == 'undefined')
			return callback(new Error("Weather station data not provided"),null );
		
		callback(null,data);
	});
}


module.exports = {
  getWaterConsumptionPrediction: getWaterConsumptionPrediction,
  getWaterConsumptionPredictionByRange: getWaterConsumptionPredictionByRange
}