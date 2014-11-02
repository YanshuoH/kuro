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
        .when('/board', {
            templateUrl: 'partials/project/personal',
            controller: 'BoardCtrl'
        })
        // be careful of the order create and :taskId
        .when('/project/create', {
            templateUrl: 'partials/project/projectForm',
            controller: 'ProjectFormCtrl'
        })
        .when('/project/:projectId', {
            templateUrl: 'partials/project/project',
            controller: 'ProjectCtrl'
        })
        .when('/project/:projectId/edit', {
            templateUrl: 'partials/project/projectForm',
            controller: 'ProjectFormCtrl'
        })
        // task board
        .when('/project/:projectId/taskboard', {
          templateUrl: 'partials/task/taskboard',
          controller: 'TaskBoardCtrl',
          reloadOnSearch: false
        })
        // be careful of the order create and :taskId
        .when('/task/create', {
            templateUrl: 'partials/task/taskForm',
            controller: 'TaskFormCtrl'
        })
        .when('/task/:taskId', {
            templateUrl: 'partials/task/task',
            controller: 'TaskCtrl',
            reloadOnSearch: false
        })
        .when('/task/:taskId/edit', {
            templateUrl: 'partials/task/taskForm',
            controller: 'TaskFormCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
});