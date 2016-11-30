var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    res.json({
    	msg: 'API is running'
    });
});

module.exports = router;
