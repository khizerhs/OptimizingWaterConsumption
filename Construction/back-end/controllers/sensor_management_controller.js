'use strict';


var mongoose = require('mongoose'),
  Sensor = mongoose.model('Sensor');

exports.list_sensors = function(req, res) {
  Sensor.find({}, function(err, sensor) {
    if (err)
      res.send(err);
    res.json(sensor);
  });
};




exports.create_sensor = function(req, res) {
  var new_sensor = new Sensor(req.body);
  new_sensor.save(function(err, sensor) {
    if (err)
      res.send(err);
    res.json(sensor);
  });
};


exports.read_sensor = function(req, res) {
  Sensor.findById(req.params.Sensor, function(err, sensor) {
    if (err)
      res.send(err);
    res.json(sensor);
  });
};


exports.update_sensor = function(req, res) {
  Sensor.findOneAndUpdate(req.params.sensorId, req.body, {new: true}, function(err, sensor) {
    if (err)
      res.send(err);
    res.json(sensor);
  });
};


exports.delete_sensor = function(req, res) {


  Sensor.remove({
    _id: req.params.sensorId
  }, function(err, sensor) {
    if (err)
      res.send(err);
    res.json({ message: 'Sensor successfully deleted' });
  });
};
