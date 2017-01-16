'use strict';

var libs = process.cwd() + '/libs/';
var express = require('express'),
    Promise = require('bluebird'),
    jwtauth = require(libs + 'auth/jwtauth'),
    User = require(libs + 'model/user'),
    log = require(libs + 'log')(module);

var router = express.Router();

/**
 * @api {post} /auth/users Register a new User
 * @apiGroup Auth
 * @apiParam {String} username Username or email
 * @apiParam {String} password User's password
 * @apiParamExample {json} Input
 *    {
 *      "username": "Hele",
 *      "password": "somepassword"
 *    }
 * @apiSuccess {String} status Response Status
 * @apiSuccess {Number} id User's object mongo id
 * @apiSuccess {String} username Username
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 * {
 *   "status": "OK",
 *   "id": "587d1d086d10db2b766c9399",
 *   "username": "Hele"
 * ]
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 500 Internal Server Error
 */
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
            id: newUser._id,
            username: newUser.username
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


/**
 * @api {post} /auth/token Get a JWT token
 * @apiGroup Auth
 * @apiParam {String} username Username or email
 * @apiParam {String} password User's password
 * @apiParamExample {json} Input
 *    {
 *      "username": "Hele",
 *      "password": "somepasword"
 *    }
 * @apiSuccess {String} username User's username
 * @apiSuccess {String} id_token AWT token for authentication
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 * {
 *  "username": "elnu",
 *  "id_token":                 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODdkMWQwODZkMTBkYjJiNzY2YzkzOTkiLCJ1c2VybmFtZSI6ImVsbnUiLCJoYXNoZWRQYXNzd29yZCI6IjE4M2MwMzM4Mzg4ZGFlOGU1OTM4ZmRhNjgxZWFiMzI0NTU4Y2I1NzQiLCJzYWx0IjoiOWI4ZDU1Mzc2Y2Y5MjU5MWM3NGNkNTg0YmQxZTkxNDVkZDAxYzY0ZTEwODE3MmNlODA4ZThlNjlmZWY3YzJmOSJ9. e HD52UneLAKlS*idnozXm_9W0y9jT0UsB5f1A5qz6OfI"
 * }
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 500 Internal Server Error
 */
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