'use strict';

var libs = process.cwd() + '/libs/';

var _ =         require('lodash'),
    jwt =       require('express-jwt'),
    jwtwt =     require('jsonwebtoken'),
    config =    require(libs + 'config');


exports.token = function createToken (user) {
    return jwtwt.sign(_.omit(user,'password'), config.get('default:client:clientSecret'), { expiresIn: 60 * 60 * 5 });    
};

exports.jwtCheck = jwt({
    secret: config.get('default:client:clientSecret')
});