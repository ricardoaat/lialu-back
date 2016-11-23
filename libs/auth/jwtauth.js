var libs = process.cwd() + '/libs/';

var db = require(libs + 'db/mongoose');
var User = require(libs + 'model/user');
var jwt = require('jsonwebtoken');

var config = require(libs + 'config');

exports.authenti = function (req, res) {
    User.findOne({ username: req.body.username }, function(err, user){
        if (err) {
            return res(err);
        }

        if (!user || !user.checkPassword(req.body.password)){
            return res(null, false);
        }

        var token = jwt.sign(user, config.get('default:client:clientSecret'),
        {
            expiresIn: config.get('security:tokenLife')
        });        

        res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
        });
    });
};