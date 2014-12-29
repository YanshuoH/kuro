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


kuroApp.controller('TaskCtrl', function($scope, $http, $route, $routeParams, $location, apiService, urlParserService, taskModalData) {

    $scope.$watch(function() {
        return $location.hash();
    }, function(value) {
        if (!!value) {
            $scope.loadTaskFromHash(value);
        }
    })

    $scope.loadTaskFromHash = function(hash) {
        var hashParams = urlParserService.getTaskParamFromHash($location.hash());
        if (typeof(hashParams.taskId) === 'undefined') {
            throw 'Not a legal hash query';
        } else {
            $scope.hashParams = hashParams;
            $scope.taskId = $scope.hashParams.taskId;
        }

        // Route param is no longer working because no route config for this controller
        $scope.projectId = $scope.projectId = urlParserService.getProjectId($location.path());
        apiService.getTask($scope.projectId, $scope.taskId)
            .then(function(task) {
                $scope.task = task;
            });
    }

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
        apiService.getTask($scope.projectId, $scope.taskId)
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
            apiService.putTask($scope.formData, $scope.projectId, $scope.task.shortId)
                .then(function(response) {
                    console.log(response);
                })
        }
    }
});