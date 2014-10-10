'use strict';

/* Controllers */
var kuroApp = angular.module('Kuro');

kuroApp.controller('HomeCtrl', function($scope, $http) {

});

kuroApp.controller('BoardCtrl', function($scope, $http) {
    $http({
        method: 'GET',
        url: '/api/project'
    }).success(function(data, status) {
        $scope.projects = data;
    }).error(function(data, status) {

    });
})

kuroApp.controller('ProjectCtrl', function($scope, $http, $routeParams) {
    $scope.projectId = $routeParams.projectId;
    $http({
        method: 'GET',
        url: '/api/project/' + $scope.projectId
    }).success(function(data, status) {
        $scope.project = data;
    }).error(function(data, status) {

    });
});

kuroApp.controller('ProjectFormCtrl', function($scope, $http, $routeParams) {
    $scope.projectId = $routeParams.projectId;
    $scope.formData = {}
    $scope.isNew = true;
    if (typeof($routeParams.projectId) !== 'undefined') {
        $scope.projectId = $routeParams.projectId;
        $http({
            method: 'GET',
            url: '/api/project/' + $scope.projectId
        }).success(function(data, status) {
            $scope.project = data;
            $scope.formData = $scope.project;
            $scope.isNew = false;
        }).error(function(data, status) {

        });
    }
})

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


kuroApp.controller('TaskCtrl', function($scope, $http, $routeParams, StorageService, TaskService) {
    $scope.taskId = $routeParams.taskId;
    $http({
        method: 'GET',
        url: '/api/task/' + $scope.taskId
    }).success(function(data, status, headers, config) {
        $scope.task = data;
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
