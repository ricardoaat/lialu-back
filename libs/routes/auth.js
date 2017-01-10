'use strict';

var libs = process.cwd() + '/libs/';
var express = require('express'),
    Promise = require('bluebird'),
    jwtauth = require(libs + 'auth/jwtauth'),
    User = require(libs + 'model/user'),
    log = require(libs + 'log')(module);

var router = express.Router();

router.post('/users', function (req, res) {
    var userScheme = getUserScheme(req);

    if (!userScheme.username || !req.body.password) {
        return res.status(400).json({
            error: "Don't forget the password or username dude"
        });
    }

    User.findOne({
        username: userScheme.username
    }).then(function (user) {
        if (user) {
            throw new Promise.OperationalError('That dude is already here bro');
        } else {
            var newUser = new User({
                username: req.body.username,
                password: req.body.password
            });
            return newUser.save();
        }
    }).then(function (newUser) {
        log.info('New user: %s', newUser.id);
        return res.json({
            status: 'OK',
            user: newUser
        });
    }).error(function (err) {
        res.status(400).json({
            error: err.cause
        });
    }).catch(function (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({
                error: 'Validation error'
            });
        } else {
            res.status(500).json({
                error: 'Server error',
                description: err.message
            });
        }
        log.error('Internal error(%d): %s', res.statusCode, err.message);
    });
});

router.post('/token', function (req, res) {
    var userScheme = getUserScheme(req);

    if (!userScheme.username || !req.body.password) {
        return res.status(400).json({
            error: 'Don\'t forget the password or username dude'
        });
    }

    User.findOne({
        username: userScheme.username
    }).select('username hashedPassword salt').exec().then(function (user) {
        log.info('LogIn: Username Found! ' + user);
        if (!user.checkPassword(req.body.password)) {
            return res.status(401).json({
                error: 'Wrong password m8'
            });
        }
        return res.json({
            username: user.username,
            id_token: jwtauth.token(user)
        });
    }).error(function (err){
        log.info('User Not found' + err);
        return res.status(401).json({
            response: err
        });
    }).catch(function (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({
                error: 'Validation error'
            });
        } else {
            res.status(500).json({
                error: 'Server error',
                description: err.message
            });
        }
        log.error('Internal error(%d): %s', res.statusCode, err.message);
    });

});

function getUserScheme (req) {

    var username;
    var type;
    var userSearch = {};

    if (req.body.username) {
        username = req.body.username;
        type = 'username';
        userSearch = {
            username: username
        };
    } else if (req.body.email) {
        username = req.body.email;
        type = 'email';
        userSearch = {
            email: username
        };
    }

    return {
        username: username,
        type: type,
        userSearch: userSearch
    };
}

module.exports = router;