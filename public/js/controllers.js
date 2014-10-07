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
module.controller('MyCtrl1', function ($scope) {
    // write Ctrl here
})
module.controller('MyCtrl2', function ($scope) {

})
    // write Ctrl here
