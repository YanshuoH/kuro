'use strict';

var kuroApp = angular.module('Kuro');

kuroApp.controller('HomeCtrl', function($scope, $http) {

});

kuroApp.controller('TestCtrl', function($scope, $modal, $templateCache, apiService) {
  $scope.contacts = [
    { name: 'Sharon'},
    { name: 'Steve'}
  ];
});
