'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
errorHandler = require('../errors.server.controller'),
mongoose = require('mongoose'),
MyAppUser = mongoose.model('myAppUser');

/**
 * Signup
 */
exports.signup = function(req, res) {

	// Init Variables
	var myAppUser = new MyAppUser(req.body);
	var message = null;

	// Then save the user
	myAppUser.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			myAppUser.password = undefined;
			
			req.login(myAppUser, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(myAppUser);
				}
			});
		}
	});
};


exports.signin = function(req, res) {
	MyAppUser.findOne({userName: req.body.userName},function (err, user) {
	  if (err) {
	  	console.log('Error in signin');
	  	return console.error(err);
	  }else {
	  	if(user && req.body.userName==user.userName && req.body.password==user.password){
	  		res.json(user);
	  	}else {
	  		res.status(403).send({message: 'User is not authorized'});
	  	}	  	
	  }
	});
};