'use strict';
var path = require('path')

var user_home = path.join(__dirname, '../../front-end/user/')

module.exports = function(app) {

  app.route('/user-dash.html')
    .get(function (req, res) {
        res.sendfile(user_home + 'index.html')
    })
};
