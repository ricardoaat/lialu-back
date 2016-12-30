'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Article
var Profile = new Schema({
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
});


module.exports = mongoose.model('Profile', Profile);