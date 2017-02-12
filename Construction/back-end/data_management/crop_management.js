'use strict';


var mongoose = require('mongoose'),
    schema = require('./schema'),
  Crop = schema.Crop;

exports.list_crops = function(req, res) {
  Crop.find({}, function(err, crop) {
    if (err)
      res.send(err);
    else
      res.json(crop);
  });
};

exports.create_crop = function(req, res) {
  var new_crop = new Crop(req.body);
  new_crop.save(function(err, crop) {
    if (err)
      res.send(err);
    else
      res.status(201).json(crop);
  });
};


exports.read_crop = function(req, res) {
  Crop.findById(req.params.cropId, function(err, crop) {
    if (crop == undefined || crop == null)
      res.status(404).json({message: 'Crop Not found'});
    else if (err)
      res.send(err);
    else
      res.json(crop);
  });
};


exports.update_crop = function(req, res) {
  Crop.findOneAndUpdate(req.params.cropId, req.body, {new: true}, function(err, crop) {
    if (crop == undefined || crop == null)
      res.status(404).json({message: 'Crop Not found'});
    else if (err)
      res.status(400).json(err);
    else    
      res.json(crop);
  });
};


exports.delete_crop = function(req, res) {


  Crop.remove({
    _id: req.params.cropId
  }, function(err, crop) {
    if (err)
      res.status(400).json(err);
    else
      res.json({ message: 'Crop successfully deleted' });
  });
};



/*

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
            email : req.params.crop_id
        }, function(err) {
            callback(err);
    });
}*/
