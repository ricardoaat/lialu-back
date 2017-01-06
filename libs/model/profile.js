'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Article
var Profile = new Schema({
    nickname: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    birthday: {
        type: Date
    },
    description: {
        type: String
    },
    modified: {
        type: Date,
        default: Date.now
    },
    belongsTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    created: {
        type: Date,
        default: Date.now
    },
    loves: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }] 
});


module.exports = mongoose.model('Profile', Profile);