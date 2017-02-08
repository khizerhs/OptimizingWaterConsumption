'use strict';
module.exports = function(app) {
  var smartIrrigation = require('../data_management/crop_management');


  app.route('/crops')
    .get(smartIrrigation.list_crops)
    .post(smartIrrigation.create_crop);


  app.route('/crops/:cropId')
    .get(smartIrrigation.read_crop)
    .put(smartIrrigation.update_crop)
    .delete(smartIrrigation.delete_crop);
};
