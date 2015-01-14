'use strict';

var KuroHome = angular.module('KuroHome', [
    'ui.bootstrap',
]);

KuroHome.run(['$location', '$window', 'Auth', function($location, $window, Auth) {
    Auth.loginCheck(function(response) {
        if (typeof(response.status) !== 'undefined' && response.status === 200) {
            $window.location.href = $window.location.origin + '/archive';
        }
    })
}]);
