'use strict';
module.exports = function(app) {
  var smartIrrigation = require('../data_management/user_management');


  app.route('/users')
    .get(smartIrrigation.list_users)
    .post(smartIrrigation.create_user);


  app.route('/users/:userId')
    .get(smartIrrigation.read_user)
    .put(smartIrrigation.update_user)
    .delete(smartIrrigation.delete_user);

  app.route('/users/login')
    .post(smartIrrigation.login_user);
};
