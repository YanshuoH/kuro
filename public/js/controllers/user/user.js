'use strict';

var kuroApp = angular.module('Kuro');

kuroApp.controller('SignupCtrl', function($scope, $http) {
    
});

kuroApp.controller('SigninCtrl', function($scope, $http, $location, userApiService) {
    $scope.formData = {};
    $scope.submitForm = function() {
        userApiService.signin($scope.formData)
            .then(function(response) {
                console.log(response);
                $location.path('/board');
            });
        var url = '/api/user/signin';
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