'use strict';
module.exports = function(app) {
  var smartIrrigation = require('../data_management/water_history_management');


  app.route('/water-history')
    .get(smartIrrigation.list_wchs);
    //.post(smartIrrigation.create_crop);


  app.route('/water-history/:cropUserId')
    .get(smartIrrigation.read_wch)
    .put(smartIrrigation.update_wch)
    .delete(smartIrrigation.delete_wch);
};
