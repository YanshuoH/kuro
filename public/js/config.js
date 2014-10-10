'use strict';

var kuro = angular.module('Kuro');

kuro.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/board', {
          templateUrl: 'partials/board',
          controller: 'BoardCtrl'
        })
        .when('/task/create', {
            templateUrl: 'partials/taskForm',
            controller: 'TaskFormCtrl'
        })
        .when('/task/:taskId', {
            templateUrl: 'partials/task',
            controller: 'TaskCtrl'
        })
        .when('/task/:taskId/edit', {
            templateUrl: 'partials/taskForm',
            controller: 'TaskFormCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
});