'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * User Schema
 */
var questionSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true,
		required: 'Content cannot be blank'
	},
	createdUser: {
		type: String,
		trim: true
	},
	votes: {
		type: Number,
		default: 0,
		trim: true
	},
	numberOfAnswers: {
		type: Number,
		default: 0,
		trim: true
	},
	modified: {
		type: Date,
		default: Date.now
	}
});

questionSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};

mongoose.model('questions', questionSchema);