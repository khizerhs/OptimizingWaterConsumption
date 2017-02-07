'use strict';
module.exports = function(app) {
  var smartIrrigation = require('../controllers/smartIrrigation-sensor-controller');


  app.route('/sensorsTest')
    .get(smartIrrigation.list_sensors)
    .post(smartIrrigation.create_sensor);


  app.route('/sensorsTest/:sensorId')
    .get(smartIrrigation.read_sensor)
    .put(smartIrrigation.update_sensor)
    .delete(smartIrrigation.delete_sensor);
};
