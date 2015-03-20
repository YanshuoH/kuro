'use strict';

var kuroApp = angular.module('Kuro');

kuroApp.controller('HomeCtrl', function($scope, $http) {

});

kuroApp.controller('TestCtrl', function($scope, $modal, $templateCache, apiService) {
    $scope.items = [
        'test1', 'test2', 'test3', 'test4'
    ];

    $scope.sortableOptions = {
        itemMoved: function(event) {
            console.log('moved');
        },
        orderChanged: function(event) {

        }
    };
});
