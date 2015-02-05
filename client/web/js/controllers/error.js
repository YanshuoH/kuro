'use strict';

var kuroApp = angular.module('Kuro');

kuroApp.controller('ErrorCtrl', function($scope, $location, errorData) {
    $scope.hasError = false;
    $scope.messageType = '';
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
            $scope.wording = modalErrorContent.message;
            switch(modalErrorContent.status) {
                case 200:
                    $scope.messageType = 'alert-success';
                    break;
                case 204:
                    $scope.messageType = 'alert-info';
                    break;
                case 500:
                    $scope.messageType = 'alert-warning';
                    break;
                case 401:
                    $scope.messageType = 'alert-danger';
                    break;
                }
        } else if (typeof(modalErrorContent.message) !== 'undefined' && modalErrorContent.message.length === 0) {
            $scope.modalHasError = false;
        }
    });
});