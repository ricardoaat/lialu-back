'use strict';

var express = require('express'),
	router = express.Router(),
	libs = process.cwd() + '/libs/',
	log = require(libs + 'log')(module),
	Profile = require(libs + 'model/profile');


router.get('/', function(req, res) {

    Profile.find().then(function(profiles){
        return res.json(profiles);
    })
    .catch(function(err){
        res.statusCode = 500;
        log.error('Internal error(%d): %s',res.statusCode,err.message);

        return res.json({ 
            error: 'Server error' 
        });        
    });
});

router.post('/', function(req, res) {
	
	var profile = new Profile({
		name: req.body.name,
        lastname: req.body.lastname,
        birthday: req.body.birthday,
        description: req.body.description,
        belongsTo: req.body.belongsTo,
	});

	profile.save(function (err) {
		if (!err) {
			log.info("New profile created with id: %s", profile.id);
			return res.json({ 
				status: 'OK', 
				profile:profile 
			});
		} else {
			if(err.name === 'ValidationError') {
				res.statusCode = 400;
				res.json({ 
					error: 'Validation error' 
				});
			} else {
				res.statusCode = 500;
				res.json({ 
					error: 'Server error' 
				});
			}
			log.error('Internal error(%d): %s', res.statusCode, err.message);
		}
	});
});

router.get('/:id', function(req, res) {
	
	Profile.findById(req.params.id, function (err, profile) {
		
		if(!profile) {
			res.statusCode = 404;
			
			return res.json({ 
				error: 'Not found' 
			});
		}
		
		if (!err) {

			return res.json({ 
				status: 'OK', 
				article:profile 
			});
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s',res.statusCode,err.message);
			
			return res.json({ 
				error: 'Server error' 
			});
		}
	});
});

router.delete('/:id', function(req, res) {
	
	Profile.findById(req.params.id, function (err, profile) {
		
		if(!profile) {
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

    function deleteProfileRes(err, profile) {
        if (err){
            log.info("Database Error" + err);
            return res.status(400).json({
                response: err
            });                
        } else {
            return res.json({
                response: "Deleted user " + profile
            });
        }
    }    
});

module.exports = router;