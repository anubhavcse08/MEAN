'use strict';

module.exports = function(app) {
	
	//My App - Root routing
	var myapp = require('../../app/controllers/myapp.server.controller');
	app.route('/').get(myapp.index);
	
};
