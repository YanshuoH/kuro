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

    $scope.isNew = true;
    $scope.formData = {};
    apiService.getTask($scope.taskId)
        .then(function(task) {
            $scope.isNew = false;
            $scope.task = task;
            $scope.formData = task;
        });

    $scope.changeHash = function(hash) {
        $location.hash(hash);
    }

});

kuroApp.controller('TaskFormCtrl', function($scope, $http, $routeParams, $location, apiService) {
    $scope.formData = {};
    $scope.projectId = $routeParams.projectId;
    $scope.isNew = true;

    // apiService.getProject($scope.projectId)
    //     .then(function(project) {
    //         $scope.project = project;
    //     })

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
        if ($scope.isNew) {
            apiService.createTask($scope.formData, $scope.projectId)
                .then(function(response) {
                    console.log(response);
                });
        } else {
            console.log($scope.formData);
            apiService.putTask($scope.formData, $scope.task.shortId)
                .then(function(response) {
                    console.log(response);
                })
        }
    }
});