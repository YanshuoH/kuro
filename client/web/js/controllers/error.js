'use strict';

var kuroApp = angular.module('Kuro');

kuroApp.controller('ErrorCtrl', function($scope, $location, errorData) {
    $scope.hasError = false;

    // Syn with errorData
    $scope.$watch(function () { return errorData.getErrorContent(); }, function(errorContent) {
        if (typeof(errorContent.message) !== 'undefined' && errorContent.message.length > 0) {
            $scope.hasError = true;
            $scope.wording = errorContent.message
        }
    });
});