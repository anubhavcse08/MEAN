'use strict';

// allQuestionsController controller
angular.module('myapp').controller('allQuestionsController', ['$scope','userDetailsService',function($scope,userDetailsService) {

	console.log('loading allQuestionsController');

	console.log(userDetailsService.useruserDetail);

}]);
