'use strict';
module.exports = function(app) {
  var arduinoControlManagement = require('../data_management/arduino_control_management');
  var mqtt_client = require('../mqtt/mqtt_module').mqtt_client

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

  app.route('/arduino_valve_control')
    .put(function(req, res) {
        console.log('/arduino_valve_control ' + req.param('switch'))
        
        if (null === mqtt_client) {
          res.status(404).send()
        }
        
        mqtt_client.publish('valve-control', req.param('switch'), {retain: true})
        res.status(200).send()
    })  

  app.route('/arduino_mad_control')
    .put(function(req, res) {
        console.log('/arduino_mad_control ' + req.param('mad'))
        
        if (null === mqtt_client) {
          res.status(404).send()
        }
        
        mqtt_client.publish('lower-limit', req.param('mad'), {retain: true})
        res.status(200).send()
    })  

  app.route('/arduino_pouring_time_control')
    .put(function(req, res) {
        console.log('/arduino_pouring_time_control ' + req.param('time'))
        
        if (null === mqtt_client) {
          res.status(404).send()
        }
        
        mqtt_client.publish('num-iter', req.param('time'), {retain: true})
        res.status(200).send()
    })  
};
