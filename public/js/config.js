'use strict';

var myApp = angular.module('Kuro');

myApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider.
        when('/board', {
          templateUrl: 'partials/board',
          controller: 'BoardCtrl'
        }).
        otherwise({
          redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
});