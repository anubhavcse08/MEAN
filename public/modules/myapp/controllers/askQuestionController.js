'use strict';

// askQuestionController controller
angular.module('myapp').controller('askQuestionController', ['$scope',function($scope) {

	console.log('loading askQuestionController');

	$scope.postQuestion = function(){
		console.log('Inside Post Qiestion Function');
		alert('MUthu');
	};

}]);