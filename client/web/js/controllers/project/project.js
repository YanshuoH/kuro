'use strict';

var kuroApp = angular.module('Kuro');


kuroApp.controller('BoardCtrl', function($scope, $http, $location, apiService) {
    $scope.projects = [];
    $scope.showTaskboard = false;

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

    
    $scope.showTaskboardFunc = function(projectShortId) {
        console.log(projectShortId);
        apiService.getTaskList(projectShortId)
          .then(function(tasks) {
            $location.path('/project/' + projectShortId + '/taskboard', false);
            $scope.showTaskboard = true;
            $scope.tasks = projectShortId;
          })
    }
    $scope.createProject = function() {
        $location.path('/project/create');
    }
})

kuroApp.controller('ProjectCtrl', function($scope, $http, $location, $routeParams, apiService) {
    $scope.currentHash = '';
    $scope.projectId = $routeParams.projectId;

    $scope.changeHash = function(hash) {
        $scope.currentHash = hash;
        $location.hash(hash);
    };

    apiService.getProject($scope.projectId)
        .then(function(project) {
            console.log(project)
            $scope.project = project;
        })

    $scope.formData = {};
    $scope.addUserSubmitForm = function() {
        apiService.addUserToProject($scope.formData, $scope.projectId)
            .then(function(user) {
                $scope.project.users.push(user);
            });
    }
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