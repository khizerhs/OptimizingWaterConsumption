'use strict';


var mongoose = require('mongoose'),
    schema = require('./schema'),
  User = schema.User;

exports.list_users = function(req, res) {
  User.find({}, function(err, user) {
    if (err)
      res.send(err);
    else
      res.json(user);
  });
};


exports.create_user = function(req, res) {
  var new_user = new User(req.body);
  new_user.save(function(err, user) {
    if (err)
      res.status(400).json(err);	
    else 
      res.status(201).json(user);
  });
};


exports.read_user = function(req, res) {
  User.findById(req.params.userId, function(err, user) {
    if (user == undefined || user == null)
      res.status(404).json({message: 'User Not found'});
    else if (err)
      res.send(err);
    else
      res.json(user);
  });
};


exports.update_user = function(req, res) {
  User.findOneAndUpdate(req.params.userId, req.body, {new: true}, function(err, user) {
    if (user == undefined || user == null)
      res.status(404).json({message: 'User Not found'});
    else if (err)
      res.status(400).json(err);
    else    
      res.json(user);
  });
};


exports.delete_user = function(req, res) {


  User.remove({
    _id: req.params.userId
  }, function(err, user) {
    if (err)
      res.status(400).json(err);
    else
      res.json({ message: 'User successfully deleted' });
  });
};

exports.login_user = function(req, res) {
  if (undefined === req.body.name || undefined === req.body.password ) {
    res.status(400).send('')
  } else {
    console.log('login user: ' + req.body.name)

    User.findOne({login: req.body.name}, function(err, user) {
      if (user == undefined || user == null)
        res.status(404).send()
      else if (err)
        res.send(err)
      else {
        if (req.body.password != user.pass) {
          res.status(406).send()
        } else {
          res.status(200).send(user)
        }
      }
    });
  }  
}

/*
var schema = require('./schema');

var UserManagement = schema.User;


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

exports.getUsers = function (query,callback){
		UserManagement.find(function(err, users) {
				callback(err,users)
		});
	
	
}*/
