'use strict';
module.exports = function(app) {
  var smartIrrigation = require('../data_management/sensor_history_management');


  app.route('/sensor-history')
    .get(smartIrrigation.all_sensor_history);
    //.post(smartIrrigation.create_crop);


  app.route('/sensor-history/:sensorId')
    .get(smartIrrigation.read_sensor_history);

  app.route('/sensor-history-range')
    .get(smartIrrigation.read_sensor_history_range);
};
