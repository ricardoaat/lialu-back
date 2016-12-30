'use strict';

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    res.json({
        msg: 'API is running'
    });
});

module.exports = router;
