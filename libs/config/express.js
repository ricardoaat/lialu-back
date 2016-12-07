'use strict';

var libs = process.cwd() + '/libs/';

var express         = require('express'),
    path            = require('path'),
    morgan          = require('morgan'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    passport        = require('passport'),
    methodOverride  = require('method-override');

module.exports = function (app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(methodOverride());
    //app.use(passport.initialize());
    app.use(morgan('dev'));

};