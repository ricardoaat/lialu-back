'use strict';

var Promise = require('bluebird'),
    mongoose = Promise.promisifyAll(require('mongoose')),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	User = new Schema({
		username: {
			type: String,
			unique: true,
			required: true
		},
		hashedPassword: {
			type: String,
			required: true,
			select: false
		},
		salt: {
			type: String,
			required: true,
			select: false
		},
		created: {
			type: Date,
			default: Date.now
		}
	});

User.methods.encryptPassword = function (password) {
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
	//	more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512).toString('hex');
};

User.virtual('userId')
	.get(function () {
		return this.id;
	});

User.virtual('password')
	.set(function (password) {
		this._plainPassword = password;
		this.salt = crypto.randomBytes(32).toString('hex');
		//	more secure - this.salt = crypto.randomBytes(128).toString('hex');
		this.hashedPassword = this.encryptPassword(password);
	})
	.get(function () {
		return this._plainPassword;
	});

User.methods.checkPassword = function (password) {
	return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = mongoose.model('User', User);