'use strict';

var kuro = angular.module('Kuro');

kuro.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        // project board
        .when('/', {
            templateUrl: 'partials/home',
            controller: 'HomeCtrl'
        })
        .when('/user/signup', {
            templateUrl: 'partials/user/signup',
            controller: 'SignupCtrl'
        })
        .when('/user/signin', {
            templateUrl: 'partials/user/signin',
            controller: 'SigninCtrl'
        })
        .when('/user/profile', {
            templateUrl: 'partials/user/profile',
            controller: 'ProfileCtrl'
        })
        .when('/board', {
            templateUrl: 'partials/personal',
            controller: 'BoardCtrl'
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
        .when('/project/:projectId/taskboard', {
          templateUrl: 'partials/taskboard',
          controller: 'TaskBoardCtrl'
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