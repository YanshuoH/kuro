'use strict';

var kuroApp = angular.module('Kuro');

kuroApp.controller('HomeCtrl', function($scope, $http) {

});

kuroApp.controller('TestCtrl', function($scope, $modal, $templateCache, apiService) {
    $scope.items = [
        {name: 'test1'},
        {name: 'test2'},
        {name: 'test3'},
        {name: 'test4'}
    ];

    var param = {
        fetchUser: 1,
        fetchStatus: 1,
        fetchPriority: 1
    }

    apiService.getProject(5, param)
        .then(function(project) {
            $scope.project = project;
            $scope.statusData = project.statusData;
            $scope.formData = $scope.project;
            console.log($scope.statusData);
        });

    $scope.sortableOptions = {
        itemMoved: function(event) {
            console.log('moved');
        },
        orderChanged: function(event) {
            console.log(event);
        }
    };
});
