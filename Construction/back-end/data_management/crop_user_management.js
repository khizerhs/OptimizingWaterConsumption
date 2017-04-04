var mongoose = require('mongoose');
var schema = require('./schema');

var cropUserManagement = schema.CropUser;

exports.queryCropUserId = function (req, res) {
    return mongoose.Types.ObjectId("58caea3116a1664e9fdb71d7")
}

exports.get_crop_user = function (req, res) {
    var id = req.params.userId

    cropUserManagement.find({user_id: id}, function(err, user) {
      if (user == undefined || user == null) {
        res.status(404).send()
      } else if (err) {
        res.send(err)
      } else {
        res.status(200).send(user)
      }
    });
}

exports.update_crop_user = function (req, res) {
  cropUserManagement.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, function(err, crop_user) {
    if (crop_user == undefined || crop_user == null)
      res.status(404).json({message: 'crop_user Not found'});
    else if (err)
      res.status(400).json(err);
    else    
      res.json(crop_user);
  });
}