'use strict';

// askQuestionController controller
angular.module('myapp').controller('questionAnswerController', ['$scope','userDetailsService','$http','$location',function($scope,userDetailsService,$http,$location) {

	console.log('loading questionAnswerController');

	$scope.selectedQuestion = {};
	$scope.answers = [];
	$scope.newAnswer = {};
	
	var getAnswersForSelectedQuest = function(){
		console.log('inside getAnswersForSelectedQuest');
		$scope.selectedQuestion = userDetailsService.selectedQuestion;
		console.log('Inside getAnswersForSelectedQuest, Quest Id'+userDetailsService.selectedQuestion._id);
		$http.post('myapp/getAnswers',userDetailsService.selectedQuestion).success(function(response) {
  			$scope.answers = response;
		}).error(function(response) {
			alert(response.message);
		});
	};

	$scope.postAnswer = function() {
		console.log('inside postAnswer');
		$scope.newAnswer.answeredUser = userDetailsService.useruserDetail.userName;
		$scope.newAnswer.questionId = userDetailsService.selectedQuestion._id;
		$http.post('myapp/postAnswer',$scope.newAnswer).success(function(response) {
  			getAnswersForSelectedQuest();
  			$scope.newAnswer = {};
		}).error(function(response) {
			alert(response.message);
		});
	};

	$scope.upVoteForQuestion = function(){
		$scope.selectedQuestion.votes = $scope.selectedQuestion.votes+1;
		$http.post('/myapp/updateQuestion',$scope.selectedQuestion).success(function(response) { 
			console.log('votes up successfully');
		}).error(function(response) {
			alert(response.message);
		});
	};

	$scope.downVoteForQuestion = function(){
		$scope.selectedQuestion.votes = $scope.selectedQuestion.votes-1;
		$http.post('/myapp/updateQuestion',$scope.selectedQuestion).success(function(response) { 
			console.log('votes down successfully');
		}).error(function(response) {
			alert(response.message);
		});
	};

	$scope.upVoteForAnswer = function(answer){
		answer.votes = answer.votes+1;
		$http.post('myapp/updateAnswer',answer).success(function(response) {
  			getAnswersForSelectedQuest();
		}).error(function(response) {
			alert(response.message);
		});
	};

	$scope.downVoteForAnswer = function(answer){
		answer.votes = answer.votes-1;
		$http.post('myapp/updateAnswer',answer).success(function(response) {
  			getAnswersForSelectedQuest();
		}).error(function(response) {
			alert(response.message);
		});
	};

	getAnswersForSelectedQuest();
	
}]);