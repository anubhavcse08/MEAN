'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
errorHandler = require('../errors.server.controller'),
mongoose = require('mongoose'),
Questions = mongoose.model('questions'),
Answers = mongoose.model('answers');

/**
 * Signup
 */
exports.postQuestion = function(req, res) {

	// Init Variables
	var question = new Questions(req.body);
	var message = null;

	// Then save the user
	question.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {			
			req.login(question, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					Questions.find(function (err, quests) {
					  if (err) {
					  	console.log('Error getting Questions');
					  	return console.error(err);
					  }else {	  	
					  	res.json(quests);	  	  	
					  }
					});
				}
			});
		}
	});
};


exports.getAllQuestions = function(req, res) {
	Questions.find(function (err, quests) {
	  if (err) {
	  	console.log('Error getting Questions');
	  	return console.error(err);
	  }else {	  	
	  	res.json(quests);	  	  	
	  }
	});
};

exports.searhQuestions = function(req, res) {
	console.log('Muthu:'+req.body.searchtext);
	Questions.find({"title": { "$regex": req.body.searchtext, "$options": "i" }},function (err, quests) {
	  if (err) {
	  	console.log('Error getting Questions');
	  	return console.error(err);
	  }else {
	  	console.log(quests);
	  	console.log(quests.length);
	  	res.json(quests);	  	  	
	  }
	});
};

exports.postAnswer = function(req, res) {

	// Init Variables
	var answer = new Answers(req.body);
	var message = null;	
	var currentTime = new Date()

	Questions.findAndModify({ "_id": mongoose.Types.ObjectId(answer.questionId)}, {}, {$inc:{"numberOfAnswers": 1}, $set:{"modified": new Date()}}, {"upsert": true,"new":true}, function (err, question) {
	  if (err) {
	  	res.status(400).send(err);
	  }else {
	  	console.log('updated, numberOfAnswers is ' + question.numberOfAnswers);	
	  }	  
	});

	// Then save the user
	answer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {			
			req.login(answer, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {								  	
					res.json(answer); 	  	
				}
			});
		}
	});
};


exports.getAnswers = function(req, res) {
	Answers.find({questionId: req.body._id},function (err, answers) {
	  if (err) {
		console.log('Error getting Questions');
		return console.error(err);
	  }else {
	  	res.json(answers);
	  }
	});
};


exports.updateQuestion = function(req, res) {
	var question = new Questions(req.body);
	Questions.findByIdAndUpdate(question._id, question, function (err, tank) {
  		if (err) return handleError(err);
  		res.send(tank);
	});
};

exports.updateAnswer = function(req, res) {
	var answer = new Answers(req.body);
	Answers.findByIdAndUpdate(answer._id, answer, function (err, tank) {
  		if (err) return handleError(err);
  		res.send(tank);
	});
};