'use strict';


var libs = process.cwd() + '/libs/',
    jwtwt = require('jsonwebtoken'),
    config = require(libs + 'config');

exports.validateToken = function processRequest (req) {
    var token;
	var authori = req.headers.authorization.split(' ');
	if ( authori.length == 2 ){
		token = authori[1];
	} else {
        return 'Bad token';
    }
    return jwtwt.verify(token, config.get('default:client:clientSecret'));
};