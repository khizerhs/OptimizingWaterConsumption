var mongoose = require('mongoose');
var schema = require('./schema');

var cropUserManagement = schema.CropUser;

exports.queryCropUserId = function () {
    return mongoose.Types.ObjectId("589d54a5055013627647c9e7")
}