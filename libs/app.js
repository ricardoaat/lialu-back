'use strict';

var express = require('express'),
    libs = process.cwd() + '/libs/',
    log = require('./log')(module),
    jwtauth = require('./auth/jwtauth'),
    notFoundError = require('./errors/notFoundError.js');

var app = express();

require('./config/express')(app);
require('./config/routes')(app, jwtauth.jwtCheck);


// catch 404 and forward to error handler
app.use(function(req, res, next){
    log.error("Routing: Not found");
    next(new notFoundError("404"));
});

// error handlers
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);
    res.json({ 
    	error: err.message 
    });
    return;
});

module.exports = app;