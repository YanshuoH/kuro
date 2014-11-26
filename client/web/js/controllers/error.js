'use strict';

var kuroApp = angular.module('Kuro');

kuroApp.controller('ErrorCtrl', function($scope, $location) {
    var wordingMap = {
        '/unauthorize': 'You are not authorized',
        '/error': 'Something went wrong'
    }
    if (typeof(wordingMap[$location.$$path]) !== 'undefined') {
        $scope.wording = wordingMap[$location.$$path];
    } else {
        $scope.wording = wordingMap['/error'];
    }
});