'use strict';

// askQuestionController controller
angular.module('myapp').controller('askQuestionController', ['$scope','userDetailsService','$http','$location',function($scope,userDetailsService,$http,$location) {

	console.log('loading askQuestionController');

	$scope.userDetails = userDetailsService.useruserDetail;

	$scope.question = {};

	$scope.postQuestion = function(){
		console.log('Inside Post Qiestion Function');
		$scope.question.createdUser = userDetailsService.useruserDetail.userName;
		$http.post('myapp/postQuestion', $scope.question).success(function(response) {
			userDetailsService.allQuestions = response;
			$location.path('/allQuestions');
		}).error(function(response) {			
			alert(response.message);
		});
	};

}]);