'use strict';

var kuro = angular.module('Kuro');

kuro.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        // project board
        .when('/', {
            templateUrl: 'partials/home',
            controller: 'HomeCtrl'
        })
        // be careful of the order create and :taskId
        .when('/project/create', {
            templateUrl: 'partials/projectForm',
            controller: 'ProjectFormCtrl'
        })
        .when('/project/:projectId', {
            templateUrl: 'partials/project',
            controller: 'ProjectCtrl'
        })
        .when('/project/:projectId/edit', {
            templateUrl: 'partials/projectForm',
            controller: 'ProjectFormCtrl'
        })
        // task board
        .when('/taskboard', {
          templateUrl: 'partials/board',
          controller: 'BoardCtrl'
        })
        // be careful of the order create and :taskId
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