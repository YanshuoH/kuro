'use strict';

var kuroApp = angular.module('Kuro');

kuroApp.controller('HomeCtrl', function($scope, $http) {

});

kuroApp.controller('TestCtrl', function($scope, apiService) {
    apiService.getProjectList()
        .then(function(projects) {
            $scope.projects = projects;
        });

    $scope.dropCallback = function(event, ui) {
        console.log('Drop!');
    }
});