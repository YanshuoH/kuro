'use strict';

/* Controllers */
var module = angular.module('Kuro');

module.controller('appCtrl', ['$scope', '$http', function($scope, $http) {
    $http({
        method: 'GET',
        url: '/api/name'
    }).success(function(data, status, headers, config) {
        $scope.name = data.name;
    }).error(function(data, status, headers, config) {
        $sope.name = 'Error!';
    })
}]);

    // write Ctrl here

module.controller('BoardCtrl', function($scope, $http) {
    console.log('data');
    $http({
        method: 'GET',
        url: '/api/board'
    }).success(function(data, status, headers, config) {
        $scope.tasks = data;
    }).error(function(data, status, headers, config) {

    });
});
