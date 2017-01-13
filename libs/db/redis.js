'use strict';

var libs = process.cwd() + '/libs',
    config = require(libs + '/config'),
    Promise = require('bluebird'),
    redis = Promise.promisifyAll(require('redis')),
    client = redis.createClient(config.get('redis:port'));

client.on('connect', function () {
    console.log('connected REDIS');
});

module.exports = client;