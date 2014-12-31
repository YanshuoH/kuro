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

    // Syn with modalErrorData
    $scope.$watch(function () { return errorData.getModalErrorContent(); }, function(modalErrorContent) {
        if (typeof(modalErrorContent.message) !== 'undefined' && modalErrorContent.message.length > 0) {
            $scope.modalHasError = true;
            $scope.wording = modalErrorContent.message
        } else if (typeof(modalErrorContent.message) !== 'undefined' && modalErrorContent.message.length === 0) {
            $scope.modalHasError = false;
        }
    });
});