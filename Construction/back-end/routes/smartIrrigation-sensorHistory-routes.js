'use strict';
module.exports = function(app) {
  var sensorHistoryManagement = require('../data_management/sensor_history_management');


  app.route('/sensors-history')
    .get(function(req,res){
      var query = {      	
        crop_user_id: req.param('crop_user_id'),
		start: req.param('start'),
		end : req.param('end')
      }
      console.log("Query"+JSON.stringify(query));
      sensorHistoryManagement.getSensorsHistory(query,function(err,sensorsHistory){
        if (err)
          res.status(500).send(err.message);
        else
          res.status(200).json(sensorsHistory);
      });
      
    })
    .post(function(req,res){
      var query = {
        topic : req.param('topic'),
        value: req.param('value')      
      }
      sensorHistoryManagement.createSensorHistoryFromJson(query, function(err) {
          if (err)
            res.status(500).send(err.message);
          else
            res.status(201).json({ message: 'Sensor history created created!' });
      })
      
    });


  app.route('/sensor-history/:sensorId')
    .get(sensorHistoryManagement.read_sensor_history);

  app.route('/sensor-history-range')
    .get(sensorHistoryManagement.read_sensor_history_range);
};
