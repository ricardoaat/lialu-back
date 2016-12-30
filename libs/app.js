'use strict';

var express = require('express'),
    Promise = require('bluebird'),
    mongoose = require('mongoose'),
    libs = process.cwd() + '/libs/',
    log = require('./log')(module),
    jwtauth = require('./auth/jwtauth'),
    config = require(libs + 'config');

var app = express();

require('./config/express')(app);
require('./config/routes')(app, jwtauth.jwtCheck);

connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', function (){
      log.info('Connected to DB!!!');
    });


// catch 404 and forward to error handler
app.use( function (req, res, next){
    res.status(404);
    log.debug('%s %d %s', req.method, res.statusCode, req.url);
    res.json({ 
        error: 'Not Found'
    });
    return;
});

// error handlers
app.use( function (err, req, res, next){
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);
    res.json({ 
        error: err.message 
    });
    return;
});


function connect () {
  mongoose.Promise = Promise;
  mongoose.connect(config.get('mongoose:uri'));
  return mongoose.connection;
}

module.exports = app;