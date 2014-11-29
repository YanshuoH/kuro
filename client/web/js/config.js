'use strict';

var kuro = angular.module('Kuro');

kuro.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        // project board
        .when('/', {
            templateUrl: 'partials/home',
            controller: 'HomeCtrl'
        })
        .when('/unauthorize', {
            templateUrl: 'partials/error',
            controller: 'ErrorCtrl'
        })
        .when('/user/signup', {
            templateUrl: 'partials/user/signup',
            controller: 'SignupCtrl'
        })
        .when('/user/signin', {
            templateUrl: 'partials/user/signin',
            controller: 'SigninCtrl'
        })
        .when('/user/signout', {
            templateUrl: 'partials/user/signout',
            controller: 'SignoutCtrl'
        })
        .when('/user/profile', {
            templateUrl: 'partials/user/profile',
            controller: 'ProfileCtrl'
        })
        .when('/archive', {
            templateUrl: 'partials/project/archive',
            controller: 'BoardCtrl',
            reloadOnSearch: false
        })
        // be careful of the order create and :taskId
        .when('/project/create', {
            templateUrl: 'partials/project/projectForm',
            controller: 'ProjectFormCtrl'
        })
        .when('/project/:projectId', {
            templateUrl: 'partials/project/project',
            controller: 'ProjectCtrl',
            reloadOnSearch: false
        })
        .when('/project/:projectId/edit', {
            templateUrl: 'partials/project/projectForm',
            controller: 'ProjectFormCtrl'
        })
        // task board
        .when('/project/:projectId/taskboard', {
          templateUrl: 'partials/project/archive',
          controller: 'BoardCtrl',
          reloadOnSearch: false
        })
        // be careful of the order create and :taskId
        .when('/project/:projectId/task/create', {
            templateUrl: 'partials/task/taskForm',
            controller: 'TaskFormCtrl'
        })
        .when('/project/:projectId/task/:taskId', {
            templateUrl: 'partials/task/task',
            controller: 'TaskCtrl',
            reloadOnSearch: false
        })
        .when('/project/:projectId/task/:taskId/edit', {
            templateUrl: 'partials/task/taskForm',
            controller: 'TaskFormCtrl'
        })
        .when('/test', {
            templateUrl: 'partials/test',
            controller: 'TestCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
});