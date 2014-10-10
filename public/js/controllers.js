'use strict';

/* Controllers */
var kuroApp = angular.module('Kuro');

kuroApp.controller('BoardCtrl', function($scope, $http, StorageService) {
    $http({
        method: 'GET',
        url: '/api/board'
    }).success(function(data, status, headers, config) {
        $scope.tasks = data;
        StorageService.set('tasks', data);
    }).error(function(data, status, headers, config) {

    });
});


kuroApp.controller('TaskCtrl', function($scope, $http, $routeParams, StorageService, TaskService) {
    $scope.taskId = $routeParams.taskId
    $http({
        method: 'GET',
        url: '/api/task/' + $scope.taskId
    }).success(function(data, status, headers, config) {
        $scope.task = data;
    }).error(function(data, status) {
        
    });
});

kuroApp.controller('TaskFormCtrl', function($scope, $http, $routeParams, $location, StorageService, TaskService) {
    $scope.formData = {};
    $scope.isNew = true;
    if (typeof($routeParams.taskId) !== 'undefined') {
        $scope.formData = TaskService.getById(StorageService.get('tasks'), $routeParams.taskId);
        $scope.isNew = false;
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
