'use strict';

var kuroApp = angular.module('Kuro');

kuroApp.controller('SidebarCtrl', function($scope, $http, $route, $routeParams, $location, apiService) {
    $scope.reload = function(url) {
        $route.reload();
    }
})