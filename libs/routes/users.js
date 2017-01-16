'use strict';

var libs = process.cwd() + '/libs/',
    express = require('express'),
    User = require(libs + 'model/user'),
    log = require(libs + 'log')(module),
    acl = require('../config/security'),
    isauth = require(libs + 'auth/isAuthorized'),    
    router = express.Router();

/**
 * @api {get} /api/users List users
 * @apiGroup Users
 * @apiPermission admin
 * @apiSuccess {Object} users User's array
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 * {
 *   "users": [
 *     {
 *       "_id": "585437281594a9245304ca80",
 *       "username": "user1",
 *       "__v": 0,
 *       "created": "2016-12-28T17:01:48.664Z"
 *     },
 *     {
 *       "_id": "586234581594a9245304ca80",
 *       "username": "user2",
 *       "__v": 0,
 *       "created": "2016-12-29T00:27:36.107Z"
 *     } ]
 * }
 * @apiErrorExample {json} Server error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/', acl.middleware(2, isauth.validateToken, 'view'), function (req, res) {
        User.find().then(function (users){
            return res.json({
                users: users
            });
        }).catch(function (err){
            return res.status(400).json({
                error: err
            });
        });
    });

router.delete('/del', acl.middleware(2, isauth.validateToken, 'delete'), function (req, res) {
        var userScheme = getUserScheme(req);
        if (!userScheme.username) {
            return res.status(400).send('Don\'t forget the username or email dude');
        }
        User.findOne({ username: userScheme.username }, userdbresponse);
        
        function deleteuserres (err, user) {
            if (err){
                log.info('Database Error' + err);
                return res.status(400).json({
                    response: err
                });                
            } else {
                return res.json({
                    response: 'Deleted user ' + user
                });
            }
        }

        function userdbresponse (err, user) {
            if (err) {
                log.info('Database Error' + err);
                return res.status(400).json({
                    response: err
                });
            } else {
                if (!user) {
                    return res.status(401).json({
                        err: 'User not found'
                    });
                }
                log.info('Delete: User deleted ' + user.username);
                user.remove(deleteuserres);
           }
        }
    });

function getUserScheme (req) {
  
  var username;
  var type;
  var userSearch = {};

  // The POST contains a username and not an email
  if (req.body.username) {
    username = req.body.username;
    type = 'username';
    userSearch = { username: username };
  }
  // The POST contains an email and not an username
  else if (req.body.email) {
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