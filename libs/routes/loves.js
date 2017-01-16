'use strict';

var express = require('express'),
    router = express.Router(),
    libs = process.cwd() + '/libs/',
    Promise = require('bluebird'),
    Profile = require(libs + 'model/profile'),    
    log = require(libs + 'log')(module),
    acl = require('../config/security'),
    isauth = require(libs + 'auth/isAuthorized');


router.get('/', acl.middleware(2, isauth.validateToken, 'getall'), function (req, res) {

    Profile.findById(req.query.id).then(function (profile) {
        return res.json(profile.loves);
    }).catch(function (err) {
        res.statusCode = 500;
        log.error('Internal error(%d): %s', res.statusCode, err.message);

        return res.json({
            error: 'Server error'
        });
    });

});

router.get('/lovedBy', acl.middleware(2,isauth.validateToken, 'view'), function (req, res) {

    Profile.find({
        _id: req.query.id
    }).poulate('lovedBy').then(function (profile) {
        return res.json(profile.lovedBy);
    }).catch(function (err) {
        res.statusCode = 500;
        log.error('Internal error(%d): %s', res.statusCode, err.message);

        return res.json({
            error: 'Server error'
        });
    });

});


router.post('/', function (req, res) {

    Profile.findById(req.query.lover).then(function (profile) {
        if (profile) {
            return Profile.findById(req.query.loves).then(function (loved) {
                if (loved) {
                    var loveupdt = Profile.update({
                        _id: loved._id
                    }, {
                        $addToSet: { lovedBy: profile._id }
                    });
                    var profupdt = Profile.update({
                        _id: profile._id
                    }, {
                        $addToSet: { loves: loved._id }
                    });                    
                    return Promise.join(loveupdt, profupdt);
                } else {
                    throw new Promise.OperationalError('Not such loved with that given id');
                }
            });
        } else {
            throw new Promise.OperationalError('Not such lover with that given id');
        }
    }).then(function (profile) {
        return res.json({
            profile: profile
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

module.exports = router;