'use strict';

var kuroApp = angular.module('Kuro');

kuroApp.controller('TaskBoardCtrl', function($scope, $http, $routeParams, apiService) {
    $scope.projectId = $routeParams.projectId;
    apiService.getTaskList($scope.projectId)
        .then(function(tasks) {
            $scope.tasks = tasks;
        });

    apiService.getProject($scope.projectId)
        .then(function(project) {
            $scope.project = project;
        });
});


kuroApp.controller('TaskCtrl', function($scope, $http, $route, $routeParams, $location, apiService) {
    $scope.taskId = $routeParams.taskId;
    $scope.isNew = false;
    apiService.getTask($scope.taskId)
        .then(function(task) {
            console.log(task);
            $scope.task = task;
        });

    $scope.changeHash = function(hash) {
        $location.hash(hash);
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

kuroApp.controller('TaskFormCtrl', function($scope, $http, $routeParams, $location, StorageService) {
    $scope.formData = {};
    $scope.isNew = true;
    if (typeof($routeParams.taskId) !== 'undefined') {
        $scope.taskId = $routeParams.taskId;
        apiService.getTask($scope.taskId)
            .then(function(task) {
                $scope.task = task;
                $scope.formData = $scope.task;
                $scope.isNew = false;
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