'use strict';

angular.module('myapp').config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {            

    $urlRouterProvider.when('', '/index');
    $urlRouterProvider.when('/', '/index');

    $stateProvider
        .state('base',{
            'abstract' : true,
            url : '',          
            templateUrl: 'modules/myapp/views/basePage.html'
        })
        .state('index', {
            url: '/index',
            parent : 'base',
            controller: 'authenticationController',
            views : {
                    'center@base' : {
                    templateUrl: 'modules/myapp/views/login.html'                    
                }
            }
        })
        .state('allQuestions', {
            url: '/allQuestions',
            parent : 'base',
            controller: 'allQuestionsController',
            views : {
                    'center@base' : {
                    templateUrl: 'modules/myapp/views/allQuestion.html'                    
                }
            }
        })
        .state('askQuestion', {
            url: '/askQuestion',
            parent : 'base',
            controller: 'askQuestionController',
            views : {
                    'center@base' : {
                    templateUrl: 'modules/myapp/views/askQuestion.html'                    
                }
            }
        })
        .state('questionAnswer', {
            url: '/questionAnswer',
            parent : 'base',
            controller: 'questionAnswerController',
            views : {
                    'center@base' : {
                    templateUrl: 'modules/myapp/views/questionAnswer.html'                    
                }
            }
        });
}]);

			