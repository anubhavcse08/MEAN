'use strict';

exports.index = function(req, res) {
	res.render('myappindex', {
		user: req.user || null,
		request: req
	});
};
