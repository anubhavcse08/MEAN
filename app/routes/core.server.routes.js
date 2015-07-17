'use strict';

module.exports = function(app) {
	
	//My App - Root routing
	var myapp = require('../../app/controllers/myapp.server.controller');
	app.route('/').get(myapp.index);

	var users = require('../../app/controllers/myapp/myapp.authentication.server.controller'); 
	app.route('/myapp/auth/signup').post(users.signup);
	app.route('/myapp/auth/signin').post(users.signin);
};
