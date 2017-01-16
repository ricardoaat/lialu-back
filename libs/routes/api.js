'use strict';

var express = require('express'),
    router = express.Router();  

/**
 * @api {get} /api Api status
 * @apiGroup API
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
 *      "msg": 'API is running',
 *    }]
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/', function (req, res) {
    res.json({
        msg: 'API is running'
    });
});

module.exports = router;
