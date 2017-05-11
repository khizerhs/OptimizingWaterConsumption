var mongoose = require('mongoose');
var schema = require('./schema');
var CropUser = schema.CropUser;

exports.queryCropUserId = function (req, res) {
    return mongoose.Types.ObjectId("58caea3116a1664e9fdb71d7")
}

exports.list_crop_user = function(req, res) {
  CropUser.find({}, function(err, cropUser) {
    if (err)
      res.send(err);
    else
      res.json(cropUser);
  });
};


exports.create_crop_user = function(req, res) {
  var new_crop_user = new CropUser(req.body);
  new_crop_user.save(function(err, user) {
    if (err)
      res.status(400).json(err);  
    else 
      res.status(201).json(new_crop_user);
  });
}

exports.get_crop_user = function (req, res) {
    var id = req.params.userId

    CropUser.find({user_id: id}, function(err, user) {
      if (user == undefined || user == null) {
        res.status(404).send()
      } else if (err) {
        res.send(err)
      } else {
        res.status(200).send(user)
      }
    });
}

exports.getCropUser = function (query, callback){
	CropUser.findOne(query, function(err, cropUser) {
      callback(err,cropUser);
    });
}

exports.update_crop_user = function (req, res) {
  CropUser.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, function(err, crop_user) {
    if (crop_user == undefined || crop_user == null)
      res.status(404).json({message: 'crop_user Not found'});
    else if (err)
      res.status(400).json(err);
    else    
      res.json(crop_user);
  });
}

exports.delete_crop_user = function (req, res) {
  CropUser.remove({_id: req.params.userId}, function(err, crop_user) {
    if (crop_user == undefined || crop_user == null)
      res.status(404).json({message: 'crop_user Not found'});
    else if (err)
      res.status(400).json(err);
    else    
      res.json({ message: 'Crop user successfully deleted' });
  });
}
