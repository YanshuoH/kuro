'use strict';

var kuroApp = angular.module('Kuro');


kuroApp.controller('BoardCtrl', function($scope, $http, $location) {
    $scope.projects = [];
    $http({
        method: 'GET',
        url: '/api/project'
    }).success(function(data, status) {
        if (data) {
            if (data.status === 403) {
                $location.path('/unauthorize');
            }
            $scope.projects = data;
        }
    }).error(function(data, status) {
        console.log(data);
    });
})

kuroApp.controller('ProjectCtrl', function($scope, $http, $location, $routeParams) {
    $scope.projectId = $routeParams.projectId;
    $http({
        method: 'GET',
        url: '/api/project/' + $scope.projectId
    }).success(function(data, status) {
        if (data) {
            if (data.status === 403) {
                $location.path('/unauthorize');
            }
            $scope.project = data;
        }
    }).error(function(data, status) {
        console.log(data);
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