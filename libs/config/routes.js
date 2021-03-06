'use strict';

var libs = process.cwd() + '/libs/';

var api = require(libs + 'routes/api'),
    auth = require(libs + 'routes/auth'),
    users = require(libs + 'routes/users'),
    loves = require(libs + 'routes/loves'),
    profiles = require(libs + 'routes/profiles');

module.exports = function (app, jwt) {
    app.use('/api', jwt);
    app.use('/auth', auth);
    app.use('/api', api);
    app.use('/api/users', users);
    app.use('/api/profiles', profiles);
    app.use('/api/loves', loves);
};