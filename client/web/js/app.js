'use strict';

var kuro = angular.module('Kuro', [
    'ngRoute',
    'ngAnimate',
    'ngDragDrop',
    'ui.bootstrap',
    'ui.router',
    'ui.sortable'
]);

kuro.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}])
