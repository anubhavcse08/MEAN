'use strict';

module.exports = function(app) {
	
	//My App - Root routing
	var myapp = require('../../app/controllers/myapp.server.controller');
	app.route('/').get(myapp.index);

	var users = require('../../app/controllers/myapp/myapp.authentication.server.controller'); 
	app.route('/myapp/auth/signup').post(users.signup);
	app.route('/myapp/auth/signin').post(users.signin);

	var questionAndAnswer = require('../../app/controllers/myapp/myapp.QandA.server.controller');
	app.route('/myapp/postQuestion').post(questionAndAnswer.postQuestion);
	app.route('/myapp/getAllQuestions').post(questionAndAnswer.getAllQuestions);
	app.route('/myapp/searhQuestions').post(questionAndAnswer.searhQuestions);
	app.route('/myapp/postAnswer').post(questionAndAnswer.postAnswer);
	app.route('/myapp/getAnswers').post(questionAndAnswer.getAnswers);
	app.route('/myapp/updateQuestion').post(questionAndAnswer.updateQuestion);
	app.route('/myapp/updateAnswer').post(questionAndAnswer.updateAnswer);
};
