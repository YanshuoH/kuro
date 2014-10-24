'use strict';

var kuroApp = angular.module('Kuro');

kuroApp.controller('TaskBoardCtrl', function($scope, $http, $routeParams, StorageService) {
    $scope.projectId = $routeParams.projectId;
    $http({
        method: 'GET',
        url: '/api/project/' + $scope.projectId + '/taskboard'
    }).success(function(data, status, headers, config) {
        $scope.tasks = data;
    }).error(function(data, status, headers, config) {

    });
});


kuroApp.controller('TaskCtrl', function($scope, $http, $routeParams, $location, StorageService, TaskService) {
    $scope.taskId = $routeParams.taskId;
    $scope.isNew = false;
    $http({
        method: 'GET',
        url: '/api/task/' + $scope.taskId
    }).success(function(data, status, headers, config) {
        if (data) {
            if (data.status === 403) {
                $location.path('/unauthorize');
            }
            $scope.isNew = false;
            $scope.task = data;
        }
    }).error(function(data, status) {
        
    });

    $scope.submitForm = function() {
        var httpMethod;
        if ($scope.isNew) {
            httpMethod = 'POST'
        } else {
            httpMethod = 'PUT'
        }
        var url = '/api' + $location.$$path;
        $http({
            method: httpMethod,
            url: url,
            data: $scope.formData
        }).success(function(response, status) {
            if ($scope.isNew) {

            } else {
                var currentPath = $location.$$path;
                var pathArr = currentPath.split('/');
                pathArr.pop();
                var nextPath = pathArr.join('/');
                $location.path(nextPath);
            }
        }).error(function(err, status) {

        });
    }
});

kuroApp.controller('TaskFormCtrl', function($scope, $http, $routeParams, $location, StorageService, TaskService) {
    $scope.formData = {};
    $scope.isNew = true;
    if (typeof($routeParams.taskId) !== 'undefined') {
        $scope.taskId = $routeParams.taskId;
        $http({
            method: 'GET',
            url: '/api/task/' + $scope.taskId
        }).success(function(data, status, headers, config) {
            $scope.task = data;
            $scope.formData = $scope.task;
            $scope.isNew = false;
        }).error(function(data, status) {
            
        });
    }
    $scope.submitForm = function() {
        var httpMethod;
        if ($scope.isNew) {
            httpMethod = 'POST'
        } else {
            httpMethod = 'PUT'
        }
        var url = '/api' + $location.$$path;
        $http({
            method: httpMethod,
            url: url,
            data: $scope.formData
        }).success(function(response, status) {
            if ($scope.isNew) {

            } else {
                var currentPath = $location.$$path;
                var pathArr = currentPath.split('/');
                pathArr.pop();
                var nextPath = pathArr.join('/');
                $location.path(nextPath);
            }
        }).error(function(err, status) {

        });
    }
});