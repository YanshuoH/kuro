'use strict';

/* Directives */
var kuro = angular.module('Kuro');

kuro.directive('holderJs', function() {
    return {
        link: function(scope, element, attrs) {
            attrs.$set('data-src', attrs.holderJs);
            Holder.run({images:element.get(0), nocss:true});
        }
    };
});

kuro.directive('resizeProject', function () {
    return {
        link: function(scope, element, attrs) {
            element.bind('click', function(e) {
                $('#projectList').toggleClass('col-sm-4', 500);
            })
        }
    }
});
