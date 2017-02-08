

var schema = require('./schema');

var CropManagement = schema.Crop;

exports.createCrop = function (req,callback){
	var CropManagement = new CropManagement(req.body);
    CropManagement.save(function(err) {
            callback(err);
    });
}

exports.updateCrop = function (query, conditions,callback){
	CropManagement.findOne(query,function(err,CropManagement){
		
		if(err)
			return callback(err,null);
		
		if(CropManagement == null)
			return callback(new Error("CropManagement not found"),null );
		
		for (var key in conditions){
			
			if(key == 'email'){
				return callback(new Error('Email property cannot be modified'), null)
			}

			if(CropManagement[key] != null){
				console.log("CropManagement key exist");
				CropManagement[key] = conditions[key];
			}else{
				console.log("CropManagement key does not exist");
				CropManagement[key] = conditions[key];
			}
		}
		
		
		CropManagement.save(callback)
	
	});
}

exports.removeCrop = function (req,callback){
	CropManagement.remove({
            email : req.params.user_id
        }, function(err) {
            callback(err);
    });
}