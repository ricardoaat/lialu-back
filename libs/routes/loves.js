'use strict';

var express = require('express'),
    router = express.Router(),
    libs = process.cwd() + '/libs/',
    Promise = require('bluebird'),
    log = require(libs + 'log')(module),
    Profile = require(libs + 'model/profile');


router.get('/', function (req, res) {

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

router.get('/lovedBy', function (req, res) {

    Profile.find({
        'loves': {
            $elemMatch: [{
                belongsTo: req.query.id
            }]
        }
    }).then(function (profile) {
        return res.json(profile);
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
                    profile.loves.push(loved._id);
                    return profile.save();
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