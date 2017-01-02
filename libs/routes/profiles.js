'use strict';

var express = require('express'),
	router = express.Router(),
	libs = process.cwd() + '/libs/',
	Promise = require('bluebird'),
	log = require(libs + 'log')(module),
	Profile = require(libs + 'model/profile');


router.get('/', function (req, res) {

    Profile.find().then(function (profiles){
        return res.json(profiles);
    })
    .catch(function (err){
        res.statusCode = 500;
        log.error('Internal error(%d): %s',res.statusCode,err.message);

        return res.json({ 
            error: 'Server error' 
        });        
    });
});

router.post('/', function (req, res) {
	
	Profile.findOne({
		name: req.body.nickname
	}).then(function (profile){
		if (profile) {
			throw new Promise.OperationalError('That dude is already here bro');
		} else {
			var newProfile = new Profile({
				nickname: req.body.nickname,
				name: req.body.name,
				lastname: req.body.lastname,
				birthday: req.body.birthday,
				description: req.body.description,
				belongsTo: req.body.belongsTo,
			});			
			return newProfile.save();
		}
	}).then(function (profile){
		log.info('New profile %s', profile.id);
		return res.json({
			status: 'Created',
			profile: profile
		});
	}).error(function (err){
		res.status(400).json({
			error: err.cause
		});
	}).catch(function (err){
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

router.get('/:id', function (req, res) {
	Profile.findById(req.params.id).then(function (profile){
		return res.json({
			status: 'Created',
			profile: profile
		});
	}).catch(function (err){
		log.error('Internal error(%d): %s',res.statusCode,err.message);
		return res.status(500).json({
			error: err
		});
	});
});

router.delete('/:id', function (req, res) {

	Profile.findById(req.params.id, function (err, profile) {
		
		if (!profile) {
			res.statusCode = 404;
			
			return res.json({ 
				error: 'Not found' 
			});
		}
		
		if (!err) {
            profile.remove(deleteProfileRes);            
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s',res.statusCode,err.message);
			
			return res.json({ 
				error: 'Server error' 
			});
		}
	});

    function deleteProfileRes (err, profile) {
        if (err){
            log.info('Database Error' + err);
            return res.status(400).json({
                response: err
            });                
        } else {
            return res.json({
                response: 'Deleted user'  + profile
            });
        }
    }    
});

module.exports = router;