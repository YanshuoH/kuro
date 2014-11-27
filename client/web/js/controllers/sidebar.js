'use strict';

var kuroApp = angular.module('Kuro');

kuroApp.controller('SidebarCtrl', function($scope, navbarData) {
    $scope.reloadArchive = function(url) {
        navbarData.setShowTaskboard(false);
    }
})