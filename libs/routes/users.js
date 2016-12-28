'use strict';

var libs = process.cwd() + '/libs/',
    express = require('express'),
    db = require(libs + 'db/mongoose'),
    User = require(libs + 'model/user'),
    log = require(libs + 'log')(module),    
    router = express.Router();


router.get('/', function(req, res) {
        User.find({}, userdbresponse);
        function eraseUser(err) {
            
        }
        function userdbresponse(err, users) {
            if (err) {
                log.info("Database Error" + err);
                return res.status(400).json({
                    response: err
                });
            } else {
                log.info("Brought users");
                return res.json({
                    users: users
                });
            }
        }
    });

router.post('/del', function(req, res) {
        var userScheme = getUserScheme(req);
        if (!userScheme.username || !req.body.password) {
            return res.status(400).send("Don't forget the password or username dude");
        }
        User.findOne({ username: userScheme.username }, userdbresponse);
        
        function deleteuserres(err, user) {
            if (err){
                log.info("Database Error" + err);
                return res.status(400).json({
                    response: err
                });                
            } else {
                return res.json({
                    response: "Deleted user"
                });
            }
        }

        function userdbresponse(err, user) {
            if (err) {
                log.info("Database Error" + err);
                return res.status(400).json({
                    response: err
                });
            } else {
                if (!user) {
                    return res.status(401).json({
                        err: "User not found"
                    });
                }
                log.info("LogIn: User Query OK " + user.username);
                user.remove(deleteuserres);
           }
        }
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