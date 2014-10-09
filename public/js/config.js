'use strict';

var myApp = angular.module('Kuro');

myApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/board', {
          templateUrl: 'partials/board',
          controller: 'BoardCtrl'
        })
        .when('/task/:taskId', {
            templateUrl: 'partials/task',
            controller: 'TaskCtrl'
        })
        .when('/task/:taskId/edit', {
            templateUrl: 'partials/taskEdit',
            controller: 'TaskCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
});