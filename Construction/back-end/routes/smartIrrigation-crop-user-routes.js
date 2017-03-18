'use strict';
module.exports = function(app) {
  var smartIrrigation = require('../data_management/crop_user_management');


  app.route('/crop-user/:userId')
    .get(smartIrrigation.get_crop_user);
};
