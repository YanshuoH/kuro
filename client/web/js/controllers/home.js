'use strict';

var kuroApp = angular.module('Kuro');

kuroApp.controller('HomeCtrl', function($scope, $http) {

});

kuroApp.controller('TestCtrl', function($scope, $modal, $templateCache, apiService) {
    $scope.templateBoolean = false;
    $scope.loadTemplate = function() {
        $scope.templateBoolean = !$scope.templateBoolean;
  }
});
