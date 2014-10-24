'use strict';

var kuroApp = angular.module('Kuro');


kuroApp.controller('BoardCtrl', function($scope, $http, $location) {
    $scope.projects = [];
    $http({
        method: 'GET',
        url: '/api/project'
    }).success(function(data, status) {
        if (data) {
            if (data.status === 401) {
                $location.path('/unauthorize');
            }
            $scope.projects = data;
        }
    }).error(function(data, status) {
        console.log(data);
    });

    $scope.createProject = function() {
        $location.path('/project/create');
    }
})

kuroApp.controller('ProjectCtrl', function($scope, $http, $location, $routeParams) {
    $scope.projectId = $routeParams.projectId;
    $http({
        method: 'GET',
        url: '/api/project/' + $scope.projectId
    }).success(function(data, status) {
        if (data) {
            if (data.status === 401) {
                $location.path('/unauthorize');
            }
            $scope.project = data;
        }
    }).error(function(data, status) {
        console.log(data);
    });
});

kuroApp.controller('ProjectFormCtrl', function($scope, $http, $routeParams, $location) {
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
            console.log(data);
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