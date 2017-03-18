var mongoose = require('mongoose');
var schema = require('./schema');

var cropUserManagement = schema.CropUser;

exports.queryCropUserId = function (req, res) {
    return mongoose.Types.ObjectId("589d54a5055013627647c9e7")
}

exports.get_crop_user = function (req, res) {
    var id = req.params.userId

    cropUserManagement.findOne({user_id: id}, function(err, user) {
      if (user == undefined || user == null) {
        res.status(404).send()
      } else if (err) {
        res.send(err)
      } else {
        res.status(200).send(user)
      }
    });
}