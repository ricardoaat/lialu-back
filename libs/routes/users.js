'use strict';

var libs = process.cwd() + '/libs/',
    express = require('express'),
    db = require(libs + 'db/mongoose'),
    User = require(libs + 'model/user'),
    log = require(libs + 'log')(module),    
    router = express.Router();


router.get('/',
    function(req, res) {
        // req.authInfo is set using the `info` argument supplied by
        // `BearerStrategy`.  It is typically used to indicate scope of the token,
        // and used in access control checks.  For illustrative purposes, this
        // example simply returns the scope in the response.
        var anuser;      
        User.find({}, function(err, users) {
            if (err) {
                log.info("Database Error" + err);
                return res.status(400).json({
                    response: err
                });
            } else {
                log.info("Brought users");
                anuser = users;
            }
        });
        
        res.json({ 
        	users: anuser 
        });
    }
);

module.exports = router;