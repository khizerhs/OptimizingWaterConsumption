

var schema = require('./schema');

var UserManagement = schema.UserManagement;


exports.createUser = function (req,callback){
	var UserManagement = new UserManagement(req.body);
    UserManagement.save(function(err) {
            callback(err);
    });
}

exports.updateUser = function (query, conditions,callback){
	UserManagement.findOne(query,function(err,UserManagement){
		
		if(err)
			return callback(err,null);
		
		if(UserManagement == null)
			return callback(new Error("UserManagement not found"),null );
		
		for (var key in conditions){
			
			if(key == 'email'){
				return callback(new Error('Email property cannot be modified'), null)
			}

			if(UserManagement[key] != null){
				console.log("UserManagement key exist");
				UserManagement[key] = conditions[key];
			}else{
				console.log("UserManagement key does not exist");
				UserManagement[key] = conditions[key];
			}
		}
		
		
		UserManagement.save(callback)
	
	});
}

exports.removeUser = function (req,callback){
	UserManagement.remove({
            email : req.params.user_id
        }, function(err) {
            callback(err);
    });
}