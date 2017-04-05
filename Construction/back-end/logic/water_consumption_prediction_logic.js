var math = require('mathjs');
var Client = require('node-rest-client').Client;
var CronJob = require('cron').CronJob;
var moment = require('moment-timezone');
var client = new Client();

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

function getWeatherInfo (callback){
    var date=new Date();
    var now=date.toLocaleDateString('en-US').replace(new RegExp('/','g'),'-');
    console.log(now);
	
	
   callCimisApi(now, function(err,data){
        //console.log("Response"+JSON.stringify(data));
		if(err)
			return callback(err,null );
		
		var records=data.Data.Providers[0].Records;
		//Peak hour or the hottest time during the day is at three p.m. during the day
		var his = records[14];
		
		if(his.HlyPrecip.Value == 'null'){
			console.log("Getting data from yesterday")
			var yesterday = new Date(date.getTime());
			yesterday.setDate(date.getDate() - 1);
			callCimisApi(yesterday, function(err,data){
				if(err)
					return callback(err,null );
				records=data.Data.Providers[0].Records;
				//Peak hour or the hottest time during the day is at three p.m. during the day
				var his = records[14];
				console.log(JSON.stringify(his));
				console.log(JSON.stringify(his));
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
			console.log(JSON.stringify(his));
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
//Method that calculates the future water water consumption
exports.getWaterConsumptionPrediction = function(query,callback){
	
	var now = moment().format('LL'); 
	console.log("Date"+now);
	weatherHistoryManagement.getWeatherHistory({creation_date : now},function(err,weatherHistory){
		
		if(err)
			callback(err,null)
		else if(weatherHistory == undefined || weatherHistory == null){
			getWeatherInfo(function(err,weather_data){		
				console.log(JSON.stringify(weather_data));
				if(err)
						return callback(err,null);
				weatherHistoryManagement.getMachineLearningModel(function(err,model){		
					
					if(err)
						callback(err,null);
					else{
						console.log(JSON.stringify(model));
						var coeffs = model.coeffs.split(",").map(Number);
						var scale = model.features_scale.split(",").map(Number);
						
						var weather_record = [];
						for(var key in weather_data){	 
							weather_record.push(weather_data[key]);
						}
						var acreage = 428
						//Include acreage into the weather_record
						weather_record.unshift(acreage)
						//weather_record = weather_record.slice(2,weather_record.length);
						console.log("Weather data: "+weather_record);
						var result = []
						var prediction = 0;
						for(var i = 0; i < coeffs.length; i++){
							result.push(coeffs[i]*scale[i]*weather_record[i]);
							prediction += coeffs[i]*scale[i]*weather_record[i];
							
						}
						//The value predicted corresponds to the entire farm in one hour
						console.log("Result" +result+ "and prediction"+prediction);
						
						weather_data.water_consumption_predicted = prediction;
						
						weatherHistoryManagement.createWeatherHistory(weather_data,function(err){
							
							var cropUser = cropUserManagement.getCropUser({_id : query.crop_user_id}, function(err,cropUser){
								if(err)
									callback(err,null)
								else{
									//Return the prediction in liters in one day
									console.log(JSON.stringify(cropUser))
									predictionToLitersInOneDay = (prediction/acreage)/0.035315*cropUser.field_size*24
									callback(err,{prediction : predictionToLitersInOneDay});
								}
							})
							
						})
					}
					
				})
			
			})
		}else{
			callback(err,weatherHistory.prediction)
		}
	
	})
}

function callCimisApi(now,callback){
	var date=new Date();
    var now=date.toLocaleDateString('en-US').replace(new RegExp('/','g'),'-');
    console.log(now);
    client.get("http://et.water.ca.gov/api/data?appKey=95213f45-359b-4397-a6c3-d6bf33ced5f3&targets=211&startDate="+now+"&endDate="+now+"&dataItems=hly-precip,hly-net-rad,hly-air-tmp,hly-vap-pres,hly-rel-hum,hly-dew-pnt,hly-wind-spd,hly-wind-dir,hly-soil-tmp", function(data,response){
		if(data == 'undefined')
			return callback(new Error("Weather station data not provided"),null );
		else if(typeof data.Data.Providers[0] == 'undefined')
			return callback(new Error("Weather station data not provided"),null );
		
		callback(null,data);
	})
}


