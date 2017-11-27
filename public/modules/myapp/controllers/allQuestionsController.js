'use strict';

// allQuestionsController controller
angular.module('myapp').controller('allQuestionsController', ['$scope','$http','$location','userDetailsService',function($scope,$http,$location,userDetailsService) {

	console.log('loading allQuestionsController');
	$scope.allQuestions = [];
	$scope.currentPage = 0;
	$scope.maxSize = 5;
  $scope.searchtext = '';

	$scope.getAllQuestions = function(){
		console.log('Calling getAllQuestions');
		$http.post('myapp/getAllQuestions').success(function(response) {
  			userDetailsService.allQuestions = response;
  			$scope.allQuestions = userDetailsService.allQuestions;
  			$scope.totalItems = userDetailsService.allQuestions.length;
  			console.log('out of getAllQuestions');  			
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

    $scope.numberOfPages=function(){
        return Math.ceil($scope.allQuestions.length/$scope.maxSize);                
    };

    $scope.searhQuestions=function(){
    	var request = {};
      $scope.searchtext = $scope.searchtext;
    	console.log('Calling searhQuestions');
    	request.searchtext = $scope.searchtext;
        $http.post('myapp/searhQuestions',request).success(function(response) {
  			userDetailsService.allQuestions = response;
  			$scope.allQuestions = userDetailsService.allQuestions;
  			$scope.totalItems = userDetailsService.allQuestions.length;
  			console.log('out of searhQuestions'); 			
		}).error(function(response) {
			alert(response.message);
		});              
    };

    

}]);


angular.module('myapp').filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

angular.module('myapp').filter("filterBySearch", function() {
    return function (allQuestions, searchtext) {
        return allQuestions.filter(function (item) {          
            return (item.title.toLowerCase().indexOf(searchtext.toLowerCase()) > -1 
              || item.content.toLowerCase().indexOf(searchtext.toLowerCase()) > -1);
        });
    };
});