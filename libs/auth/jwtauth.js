var libs = process.cwd() + '/libs/';

var _ =         require('lodash'),
    express =   require('express'),    
    jwt =       require('express-jwt'),
    jwtwt =     require('jsonwebtoken'),
    config =    require(libs + 'config');

var db = require(libs + 'db/mongoose');
var User = require(libs + 'model/user');


exports.token = function createToken(user) {
    return jwtwt.sign(_.omit(user,'password'), config.get('default:client:clientSecret'), {expiresIn: 60*60*5});    
}

/*exports.authenti = function (req, res) {
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
};*/

exports.jwtCheck = jwt({
    secret: config.get('default:client:clientSecret')
});