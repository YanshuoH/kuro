'use strict';

var kuroApp = angular.module('Kuro');

kuroApp.controller('SignupCtrl', function($scope, $http) {
    
});

kuroApp.controller('SigninCtrl', function($scope, $http) {
    $scope.formData = {};
    $scope.submitForm = function() {
        var url = '/api/user/signin';
        $http({
            method: 'POST',
            url: url,
            data: $scope.formData
        }).success(function(response, status) {
            console.log(response);
        }).error(function(err, status) {
            console.log(err);
        });
    }
});

kuroApp.controller('SignoutCtrl', function($scope, $http, $location) {
    $http({
        method: 'GET',
        url: '/api/user/signout'
    }).success(function(data, status) {
        $location.path('/');
    }).error(function(data, status) {

    });
});

kuroApp.controller('ProfileCtrl', function($scope, $http) {
    $http({
        method: 'GET',
        url: '/api/project'
    }).success(function(data, status) {
        $scope.projects = data;
    }).error(function(data, status) {

    });
})