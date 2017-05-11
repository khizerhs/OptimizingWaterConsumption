'use strict';
module.exports = function(app) {
  var cropUserManagement = require('../data_management/crop_user_management');

  app.route('/crop-user')
    .post(cropUserManagement.create_crop_user)
    .get(cropUserManagement.list_crop_user)

  app.route('/crop-user/:userId')
    .get(cropUserManagement.get_crop_user)
    .put(cropUserManagement.update_crop_user)
    .delete(cropUserManagement.delete_crop_user)

  app.route('/crop-user-id/:crop_user_id')
  	.get(function(req, res) {
  		console.log("QUERY"+req.params.crop_user_id)
		cropUserManagement.getCropUser({_id : req.params.crop_user_id},function(err,cropUser){
			console.log("Crop"+JSON.stringify(cropUser))
			if (err)
                res.status(500).send(err.message);
			else if(cropUser == undefined || cropUser == null  )
				res.status(404).json({ message: 'Crop user not found' })
			else
				res.status(200).json(cropUser);
		});
    })  

  app.route('/crop-user-id/:crop_user_id/mad')
  	.get(function(req, res) {
		cropUserManagement.getCropUser({_id : req.params.crop_user_id},function(err,cropUser){
			if (err)
                res.status(500).send(err.message);
			else if(cropUser == undefined || cropUser == null  )
				res.status(404).json({ message: 'Crop user not found' })
			else
				res.status(200).json(cropUser.mad);
		});
    })
};
