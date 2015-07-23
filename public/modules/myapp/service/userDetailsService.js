'use strict';

angular.module('myapp').service('userDetailsService', function() {  
  var useruserDetail = {};
  var selectedQuestion = {};
  var allQuestions = [];
  var user = function() {
	return useruserDetail;
  };
  var getAllQuestions = function() {
	return allQuestions;
  };
  var getSelectedQuestion = function() {
	return selectedQuestion;
  }
});