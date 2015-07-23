'use strict';

// allQuestionsController controller
angular.module('myapp').controller('allQuestionsController', ['$scope','$http','$location','userDetailsService',function($scope,$http,$location,userDetailsService) {

	console.log('loading allQuestionsController');
	console.log(userDetailsService.useruserDetail);
	$scope.allQuestions = userDetailsService.allQuestions;
	$scope.currentPage = 0;
	$scope.maxSize = 5;

	var getAllQuestions = function(){
		$http.post('myapp/getAllQuestions').success(function(response) {
  			userDetailsService.allQuestions = response;
  			$scope.allQuestions = userDetailsService.allQuestions;
  			$scope.totalItems = userDetailsService.allQuestions.length;  			
		}).error(function(response) {
			alert(response.message);
		});
	}

	$scope.showQuestion = function(selectedQuestion){
		userDetailsService.selectedQuestion = selectedQuestion;
		$location.path('/questionAnswer');
	};

	$scope.sortQuestions = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
      };

	getAllQuestions();
    $scope.numberOfPages=function(){
        return Math.ceil($scope.allQuestions.length/$scope.maxSize);                
    };

    

}]);


angular.module('myapp').filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});