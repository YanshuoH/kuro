'use strict';

var kuroApp = angular.module('Kuro');


kuroApp.controller('BoardCtrl', function($scope, $http, $location, apiService) {
    $scope.projects = [];
    apiService.getProjectList()
        .then(function(projects) {
            console.log(projects);
            $scope.projects = projects;
        });

    $scope.user;
    apiService.getUserInfo()
        .then(function(user) {
            $scope.user = user;
        });

    $scope.createProject = function() {
        $location.path('/project/create');
    }
})

kuroApp.controller('ProjectCtrl', function($scope, $http, $location, $routeParams, apiService) {
    $scope.projectId = $routeParams.projectId;
    apiService.getProject($scope.projectId)
        .then(function(project) {
            $scope.project = project;
        })

    apiService.getTaskList($scope.projectId)
        .then(function(tasks) {
            $scope.tasks = tasks;
        });
});

kuroApp.controller('ProjectFormCtrl', function($scope, $http, $routeParams, $location, apiService) {
    $scope.projectId = $routeParams.projectId;
    $scope.formData = {}
    $scope.isNew = true;
    if (typeof($routeParams.projectId) !== 'undefined') {
        apiService.getProject($scope.projectId)
            .then(function(project) {
                $scope.project = project;
                $scope.formData = $scope.project;
                $scope.isNew = false;
            });
    }

    $scope.submitForm = function() {
        if ($scope.isNew) {
            apiService.createProject($scope.formData)
                .then(function(response) {
                    console.log(response);
                })
        } else {
            apiService.putProject($scope.formData, $scope.projectId)
                .then(function(response) {
                    console.log(response);
                });
        }
    }
})