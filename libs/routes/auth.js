'use strict';

var libs = process.cwd() + '/libs/';
var express = require('express'),
    _       = require('lodash'),
    jwtauth = require(libs + 'auth/jwtauth'),
    User    = require(libs + 'model/user'),
    log     = require(libs + 'log')(module);

var router  = express.Router();

router.post('/users', function(req, res) {
    function saveuserrespcheck(err, newUser) {
        if (!err){
            log.info("New user: %s", newUser.id);
            return res.json({ 
                status: 'OK', 
                article:newUser 
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
    }        
    var userScheme = getUserScheme(req);

    if (!userScheme.username || !req.body.password) {
        return res.status(400).send("Don't forget the password or username dude");
    }

    User.findOne({ username: userScheme.username }, function(err, user){
        if (err) {
            log.info("Database Error" + err);              
            return res.status(400).json({
                response: err
            });
        } else {
            log.info("Creation: User Query OK");
            if (user) {
                log.info("Username already on use " + user.username);                
                return res.status(401).json({
                    err: "That dude is already on the DB bro"
                });
            }
            var newUser = new User({
                username: req.body.username,
                password: req.body.password
            });
            newUser.save(saveuserrespcheck(err, newUser));
        }
    });

});

router.post('/token', function(req, res) { 
    var userScheme = getUserScheme(req);
    if (!userScheme.username || !req.body.password) {
        return res.status(400).send("Don't forget the password or username dude");
    }

    User.findOne({ username: userScheme.username }, function(err, user){
        if (err) {
            log.info("Database Error" + err);              
            return res.status(400).json({
                response: err
            });
        } else {
            if (!user) {
                return res.status(401).json({
                    err: "Wrong username dude"
                });
            }            
            log.info("LogIn: Username found! " + user.username);             
            if (!user.checkPassword(req.body.password)) {
                return res.status(401).json({
                    err: "Wrong password m8"
                });
            }             
            return res.status(201).json({
                username: user.username,
                id_token: jwtauth.token(user)
            });
        }
    });
});

function getUserScheme(req) {
  
  var username;
  var type;
  var userSearch = {};

  // The POST contains a username and not an email
  if(req.body.username) {
    username = req.body.username;
    type = 'username';
    userSearch = { username: username };
  }
  // The POST contains an email and not an username
  else if(req.body.email) {
    username = req.body.email;
    type = 'email';
    userSearch = { email: username };
  }

  return {
    username: username,
    type: type,
    userSearch: userSearch
  };
}

module.exports = router;
