'use strict';

module.exports = function(app) {
  var smartIrrigation = require('../data_management/sensor_management');


  app.route('/sensors')
    .get(smartIrrigation.list_sensors)
    .post(smartIrrigation.create_sensor);


  app.route('/sensors/:sensorId')
    .get(smartIrrigation.read_sensor)
    .put(smartIrrigation.update_sensor)
    .delete(smartIrrigation.delete_sensor)
};
