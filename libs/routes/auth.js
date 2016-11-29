var libs = process.cwd() + '/libs/';
var express = require('express'),
    _       = require('lodash'),
    config  = require(libs + 'config'),
    jwtauth = require(libs + 'auth/jwtauth'),
    user    = require(libs + 'model/user'),
    log     = require(libs + 'log')(module);

var router  = express.Router();

router.post('/token', function(req, res) { 
    var userScheme = getUserScheme(req);
    user.findOne({ username: userScheme.username }, function(err, user){
        if (err) {
            log.info("NO LO ENCONTRÓ");              
            return res.json({
                response: err
            });
        } else {
            log.info("NO LO ENCONTRÓ");             
            return res.json(user);
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
  }
}

module.exports = router;
