'use strict';

var libs = process.cwd() + '/libs',
    config = require(libs + '/config'),
    Promise = require('bluebird'),
    redis = Promise.promisifyAll(require('redis')),
    log = require('../log')(module),
    client = redis.createClient(config.get('redis:port'));

client.on('connect', function () {
    log.info('Connected to REDIS');
});

module.exports = client;