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
        var httpMethod;
        if ($scope.isNew) {
            httpMethod = 'POST';
        } else {
            httpMethod = 'PUT';
        }
        var url = '/api' + $location.$$path;
        $http({
            method: httpMethod,
            url: url,
            data: $scope.formData
        }).success(function(response, status) {
            console.log(response);
            if (typeof(response.status) !== 'undefined') {
                if (response.status === 401) {
                    $location.path('/unauthorize');
                } else if (response.status == 500) {
                    // TODO: err message.
                    // normally it wouldn't have to be done,
                    // because already check in angular form control
                } else if (response.status === 200) {
                    $location.path('/project/' + response.project._id);
                }
            }
        }).error(function(err, status) {
            console.log('Error!');
            console.log(err);
        });
    }
})