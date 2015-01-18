'use strict';

var appName = document.querySelector('html').getAttribute('ng-app')

var kuroApp = angular.module(appName);

kuroApp.controller('SignupCtrl', function($scope, $http, $location, $window, userApiService) {
    $scope.formData = {};
    window.formData = $scope.formData;
    $scope.submitForm = function() {
        userApiService.signup($scope.formData)
            .then(function(response) {
                if (typeof(response.status) !== 'undefined' && response.status === 200) {
                    $window.location.href = $window.location.origin + '/archive';
                }
            })
    }
});

kuroApp.controller('SigninCtrl', function($scope, $http, $location, $window, userApiService, Auth) {
    $scope.formData = {};
    $scope.submitForm = function() {
        userApiService.signin($scope.formData)
            .then(function(response) {
                if (typeof(response.status) !== 'undefined' && response.status === 200) {
                    $window.location.href = $window.location.origin + '/archive';
                }
            });
    }
});

kuroApp.controller('SignoutCtrl', function($scope, $http, $location, userApiService) {
    userApiService.signout()
        .then(function(response) {
            $location.path('/');
        })
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