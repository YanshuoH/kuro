'use strict';

var kuroApp = angular.module('Kuro');

kuroApp.controller('SidebarCtrl', function($scope, navbarData) {
    $scope.reloadArchive = function(url) {
        navbarData.setShowTaskboard(false);
        navbarData.setHideProjectListLong(false);
    }
})

kuroApp.controller('NavbarCtrl', function($scope, navbarData, Auth) {
    Auth.loginCheck(function(response) {
        if (typeof(response.status) !== 'undefined' && response.status === 200) {
            Auth.setUser(response.user);
        }
    });

    $scope.$watch(function() {
        return Auth.getUser();
    }, function(user) {
        $scope.user = user;
    })
})