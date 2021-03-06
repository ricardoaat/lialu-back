'use strict';

var express = require('express'),
    Promise = require('bluebird'),
    mongoose = require('mongoose'),
    libs = process.cwd() + '/libs/',
    log = require('./log')(module),
    jwtauth = require('./auth/jwtauth'),
    config = require(libs + 'config');

var app = express();

app.use(express.static('public'));
require('./config/express')(app);
require('./config/routes')(app, jwtauth.jwtCheck);
require('./config/security');

connect().on('error', console.error.bind(console, 'connection error:'))
         .on('disconnected', connect)
         .once('open', function (){
            log.info('Connected to Mongo!!!');
         });

// catch 404 and forward to error handler
app.use( function (req, res, next){
    res.status(404);
    log.debug('%s %d %s', req.method, res.statusCode, req.url);
    res.json({ 
        error: 'Not Found'
    });
    next();
});

// error handlers
app.use( function (err, req, res, next){
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);
    res.json({ 
        error: err.message 
    });
    next();
});


function connect () {
  mongoose.Promise = Promise;
  mongoose.connect(config.get('mongoose:uri'));
  return mongoose.connection;
}

module.exports = app;