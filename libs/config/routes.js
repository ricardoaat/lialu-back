'use strict';

var libs = process.cwd() + '/libs/';

var api = require(libs + 'routes/api'),
    auth = require(libs + 'routes/auth'),
    users = require(libs + 'routes/users');

var fail = {
  failureRedirect: '/login'
};

module.exports = function (app, jwt) {
    app.use('/api', jwt);
    app.use('/auth', auth);
    app.use('/api', api);
    app.use('/', users);
};