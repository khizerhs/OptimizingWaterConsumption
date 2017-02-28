'use strict';
var path = require('path')

var user_home = path.join(__dirname, '../public/')
// var admin_home = path.join(__dirname, '../public_admin/')

module.exports = function(app) {

  app.route('/user-dash')
    .get(function (req, res) {
        res.sendfile(user_home + 'index_user.html')
    })
  
  app.route('/admin-dash')
    .get(function (req, res) {
        res.sendfile(admin_home + 'index.html')
    })
};
