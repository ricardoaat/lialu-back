'use strict';

var node_acl = require('acl'),
    log = require('../log')(module),
    redis = require('../db/redis'),
    acl;

var redisBackend = new node_acl.redisBackend(redis, 'acl');
acl = new node_acl(redisBackend, log);
log.info('SECURITY BIIIIIIIIIIIIIIIIIIIITCH!!!');
set_roles();

function set_roles () {

    acl.allow([{
        roles: 'admin',
        allows: [{
                resources: '/api/loves',
                permissions: '*'
            }
        ]
    }, {
        roles: 'user',
        allows: [{
            resources: 'profiles',
            permissions: ['view', 'edit', 'delete']
        }]
    }, {
        roles: 'guest',
        allows: []
    }]);

    // Inherit roles
    //  Every user is allowed to do what guests do
    //  Every admin is allowed to do what users do
    acl.addRoleParents('user', 'guest');
    acl.addRoleParents('admin', 'user');
    acl.addUserRoles('5863effc17a181523b12d48e', 'admin').then(function (res){
        console.log('Added myself ' + res);
    }).catch(function (err){
        console.log('Didnt worked m8' + err);
    });

}

module.exports = acl;