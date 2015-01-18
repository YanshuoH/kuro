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


kuroApp.controller('TaskCtrl', function(
    $scope,
    $http,
    $route,
    $routeParams,
    $location,
    taskService,
    apiService,
    urlParserService,
    errorData,
    Auth)
{
    $scope.commentFormData = {};
    $scope.changeFormData = {};
    $scope.showCommentForm = false;
    $scope.taskEdited = false;
    $scope.originalTask;

    $scope.$watch(function() {
        return $location.hash();
    }, function(value) {
        if (!!value) {
            $scope.loadTaskFromHash(value);
        }
    });

    $scope.$on('edit-in-place', function () { $scope.taskEdited = true; });

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
                errorData.clear();
                $scope.task = task;
                $scope.originalTask = angular.copy(task);
                $scope.task.comments = taskService.retrieveComments(task);
            });
    };

    $scope.changeHash = function(hash) {
        $location.hash(hash);
    };

    /*
     * @param Boolean show
     */
    $scope.toggleCommentFormFunc = function() {
        $scope.showCommentForm = !$scope.showCommentForm;
    };

    $scope.submitCommentForm = function() {
        var formData = {
            type: 'comment',
            content: $scope.commentFormData
        };
        apiService.putTaskActivity(formData, $scope.projectId, $scope.taskId)
            .then(function(response) {
                if (typeof(response.status) !== 'undefined') {
                    errorData.setModalErrorContent(response.status, response.message);
                    if (response.status === 200) {
                        $scope.task = taskService.addActivity('comment', $scope.commentFormData, $scope.task, Auth.getUser());
                    }
                }
                // reset formData
                $scope.commentFormData = {}
                $scope.toggleCommentFormFunc();
            });
    };

    $scope.saveChanges = function() {
        var diffData = {
            type: 'change',
            content: taskService.taskDiff($scope.originalTask, $scope.task)
        };
        apiService.putTaskActivity(diffData, $scope.projectId, $scope.taskId)
            .then(function(response) {
                if (typeof(response.status) !== 'undefined') {
                    errorData.setModalErrorContent(response.status, response.message);
                    if (response.status === 200) {
                        $scope.task = taskService.addActivity('change', $scope.diffData, $scope.task, Auth.getUser());
                    }
                    // reset diffData
                    $scope.diffData = {};
                    $scope.taskEdited = false;
                }
            })
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
                });
        }
    };
});