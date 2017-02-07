

var schema = require('./schema');

var SensorManagement = schema.Sensor;

exports.createSensor = function (req,callback){
	var SensorManagement = new SensorManagement(req.body);
    SensorManagement.save(function(err) {
            callback(err);
    });
}

exports.updateSensor = function (query, conditions,callback){
	SensorManagement.findOne(query,function(err,SensorManagement){
		
		if(err)
			return callback(err,null);
		
		if(SensorManagement == null)
			return callback(new Error("SensorManagement not found"),null );
		
		for (var key in conditions){
			
			if(key == 'email'){
				return callback(new Error('Email property cannot be modified'), null)
			}

			if(SensorManagement[key] != null){
				console.log("SensorManagement key exist");
				SensorManagement[key] = conditions[key];
			}else{
				console.log("SensorManagement key does not exist");
				SensorManagement[key] = conditions[key];
			}
		}
		
		
		SensorManagement.save(callback)
	
	});
}

exports.removeSensor = function (req,callback){
	SensorManagement.remove({
            email : req.params.user_id
        }, function(err) {
            callback(err);
    });
}