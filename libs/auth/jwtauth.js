var libs = process.cwd() + '/libs/';

var db = require(libs + 'db/mongoose');
var User = require(libs + 'model/user');

exports.authenti = function (req, res) {
    res.json({ message: 'FUCTION TOKEN MOFOOOOOOO!!!'});
};