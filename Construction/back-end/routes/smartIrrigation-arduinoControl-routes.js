'use strict';
module.exports = function(app) {
  var arduinoControlManagement = require('../data_management/arduino_control_management');


  app.route('/arduino-control')
    .get(function(req,res){
      var query = {      	
        crop_user_id: req.param('crop_user_id')
      }
      arduinoControlManagement.getArduinoControl(query,function(err,manualIrrigation){
        if (err)
          res.status(500).send(err.message);
        else
          res.status(200).json(manualIrrigation[req.param('param')]);
      });
      
    })
    .post(function(req,res){
      arduinoControlManagement.createArduinoControl(req.body, function(err) {
          if (err)
            res.status(500).send(err.message);
          else
            res.status(201).json({ message: 'Arduino control created!' });
      })
      
    })
    .put(function(req, res) {
      arduinoControlManagement.updateArduinoControl({crop_user_id:req.param('crop_user_id')},req.body,function(err,manualIrrigation){
        if (err)
          res.status(500).send(err.message);
        else if(manualIrrigation == undefined || manualIrrigation == null  )
          res.status(404).json({ message: 'Arduino control not found' })
        else
          res.status(204).send();
      });
    })

    
};
