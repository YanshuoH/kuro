'use strict';

var KuroHome = angular.module('KuroHome', [
    'ui.bootstrap',
]);

KuroHome.run(['$location', 'Auth', function($location, Auth) {
    Auth.loginCheck(function(response) {
        console.log(response);
    })
}]);
