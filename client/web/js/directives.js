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
                $('#projectList').switchClass('col-sm-8', 'col-sm-4', scope.showTaskboardDelay);
            })
        }
    }
});

kuro.directive( 'editInPlace', function() {
    return {
        restrict: 'E',
        scope: {
            value: '=',
            fielddata: '=',
        },
        controller: 'TaskFieldCtrl',
        templateUrl: function(elem, attr) {
            return 'partials/include/' + attr.type;
        },
        link: function ( $scope, element, attrs ) {
            var inputElement = angular.element( element.children()[1] );

            element.addClass('edit-in-place');
            $scope.editing = false;
            $scope.edit = function () {
                $scope.editing = true;
                element.addClass('active');
                inputElement[0].focus();
            };

            inputElement.blur(function() {
                $scope.editing = false;
                element.removeClass('active');
                $scope.$emit('edit-in-place');
            });
        }
    };
});