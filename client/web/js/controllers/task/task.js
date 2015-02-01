'use strict';

var kuroApp = angular.module('Kuro');

kuroApp.controller('TaskBoardCtrl', [
    '$scope',
    '$http',
    '$routeParams',
    'apiService',
function(
    $scope,
    $http,
    $routeParams,
    apiService)
{
    /*
     * Begining of controller
     */
    $scope.projectId = $routeParams.projectId;
    apiService.getTaskList($scope.projectId)
        .then(function(tasks) {
            $scope.tasks = tasks;
        });

    apiService.getProject($scope.projectId)
        .then(function(project) {
            $scope.project = project;
        });
}]);


kuroApp.controller('TaskCtrl', [
    '$scope',
    '$http',
    '$route',
    '$routeParams',
    '$location',
    '$modalInstance',
    'taskService',
    'apiService',
    'urlParserService',
    'errorData',
    'Auth',
    'statusList',
    'priorityList',
function(
    $scope,
    $http,
    $route,
    $routeParams,
    $location,
    $modalInstance,
    taskService,
    apiService,
    urlParserService,
    errorData,
    Auth,
    statusList,
    priorityList)
{
    /*
     * Begining of controller
     */
    $scope.commentFormData = {};
    $scope.showCommentForm = false;
    $scope.taskEdited = false;
    $scope.taskIsDirty = false;
    $scope.originalTask;

    $scope.statusList = statusList;
    $scope.priorityList = priorityList;

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
                $scope.task.comments = taskService.retrieveComments(task);
                taskService.getFieldsLabel($scope.task, $scope.statusList, $scope.priorityList);
                $scope.originalTask = angular.copy(task);
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
            content: taskService.mapFields(
                    taskService.taskDiff($scope.originalTask, $scope.task),
                    $scope.statusList,
                    $scope.priorityList
                )
        };
        apiService.putTaskActivity(diffData, $scope.projectId, $scope.taskId)
            .then(function(response) {
                if (typeof(response.status) !== 'undefined') {
                    errorData.setModalErrorContent(response.status, response.message);
                    if (response.status === 200) {
                        $scope.task = taskService.addActivity('change', diffData, $scope.task, Auth.getUser());
                    }
                    // reset diffData
                    diffData = {};
                    $scope.taskIsDirty = true;
                    $scope.taskEdited = false;
                }
            });
    };

    $scope.resetChanges = function() {
        $scope.task =  angular.copy($scope.originalTask);
        $scope.taskEdited = false;
    };

    $scope.close = function() {
        if ($scope.taskIsDirty) {
            $modalInstance.close($scope.task);
        } else {
            $modalInstance.close(null);
        }
    };
}]);

kuroApp.controller('TaskFieldCtrl', [
    '$scope',
    'taskService',
function(
    $scope,
    taskService
    )
{
    if (typeof($scope.fielddata) !=='undefined' && $scope.fielddata instanceof Array) {
        $scope.initFieldData = function() {
            var list = [];
            for (var i=0; i<$scope.fielddata.length; i++) {
                list.push($scope.fielddata[i].label);
            }
            $scope.list = list;
        }

        $scope.updateItem = function () {
            $scope.value = angular.copy($scope.item);
        }
    }
}]);

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