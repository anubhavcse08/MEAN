'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * User Schema
 */
var myAppUserSchema = new Schema({
	employeeId: {
		type: String,
		trim: true,
		required: 'Please fill in a Employee Id',
		default: ''
	},
	userName: {
		type: String,
		unique: 'Username already exists',
		required: 'Please fill in a Username',
		default: ''
	},
	password: {
		type: String,
		required: 'Please fill in a Password',
		trim: true
	},
	email: {
		type: String,
		trim: true,
		required: 'Please fill in a Email',
		default: ''
	},
	role: {
		type: String,
		required: 'Please fill in a Role',
		trim: true
	},
});

mongoose.model('myAppUser', myAppUserSchema);