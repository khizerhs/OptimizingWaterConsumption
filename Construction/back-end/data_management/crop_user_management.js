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