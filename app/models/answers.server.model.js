'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * User Schema
 */
var answerSchema = new Schema({
	answered: {
		type: Date,
		default: Date.now
	},
	content: {
		type: String,
		default: '',
		trim: true,
		required: 'Content cannot be blank'
	},
	answeredUser: {
		type: String,
		trim: true
	},
	votes: {
		type: Number,
		default: 0,
		trim: true
	},
	questionId: {
		type: String,
		trim: true
	}
});

mongoose.model('answers', answerSchema);