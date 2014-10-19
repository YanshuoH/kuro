'use strict';

/* Controllers */
var kuroApp = angular.module('Kuro');

kuroApp.controller('HomeCtrl', function($scope, $http) {

});

kuroApp.controller('SignupCtrl', function($scope, $http) {
    
});

kuroApp.controller('SigninCtrl', function($scope, $http) {
    $scope.formData = {};
    $scope.submitForm = function() {
        var url = '/api/user/signin';
        $http({
            method: 'POST',
            url: url,
            data: $scope.formData
        }).success(function(response, status) {
            console.log(response);
        }).error(function(err, status) {
            console.log(err);
        });
    }
});

kuroApp.controller('SignoutCtrl', function($scope, $http, $location) {
    $http({
        method: 'GET',
        url: '/api/user/signout'
    }).success(function(data, status) {
        $location.path('/');
    }).error(function(data, status) {

    });
});

kuroApp.controller('ProfileCtrl', function($scope, $http) {
    $http({
        method: 'GET',
        url: '/api/project'
    }).success(function(data, status) {
        $scope.projects = data;
    }).error(function(data, status) {

    });
})

kuroApp.controller('BoardCtrl', function($scope, $http, $location) {
    $scope.projects = [];
    $http({
        method: 'GET',
        url: '/api/project'
    }).success(function(data, status) {
        if (data) {
            if (data.status === 403) {
                $location.path('/unauthorize');
            }
            $scope.projects = data;
        }
    }).error(function(data, status) {
        console.log(data);
    });
})

kuroApp.controller('ProjectCtrl', function($scope, $http, $routeParams) {
    $scope.projectId = $routeParams.projectId;
    $http({
        method: 'GET',
        url: '/api/project/' + $scope.projectId
    }).success(function(data, status) {
        $scope.project = data;
    }).error(function(data, status) {

    });
});

kuroApp.controller('ProjectFormCtrl', function($scope, $http, $routeParams) {
    $scope.projectId = $routeParams.projectId;
    $scope.formData = {}
    $scope.isNew = true;
    if (typeof($routeParams.projectId) !== 'undefined') {
        $scope.projectId = $routeParams.projectId;
        $http({
            method: 'GET',
            url: '/api/project/' + $scope.projectId
        }).success(function(data, status) {
            $scope.project = data;
            $scope.formData = $scope.project;
            $scope.isNew = false;
        }).error(function(data, status) {

        });
    }
})

kuroApp.controller('TaskBoardCtrl', function($scope, $http, $routeParams, StorageService) {
    $scope.projectId = $routeParams.projectId;
    $http({
        method: 'GET',
        url: '/api/project/' + $scope.projectId + '/taskboard'
    }).success(function(data, status, headers, config) {
        $scope.tasks = data;
    }).error(function(data, status, headers, config) {

    });
});


kuroApp.controller('TaskCtrl', function($scope, $http, $routeParams, StorageService, TaskService) {
    $scope.taskId = $routeParams.taskId;
    $http({
        method: 'GET',
        url: '/api/task/' + $scope.taskId
    }).success(function(data, status, headers, config) {
        $scope.task = data;
    }).error(function(data, status) {
        
    });

    $scope.submitForm = function() {
        var httpMethod;
        if ($scope.isNew) {
            httpMethod = 'POST'
        } else {
            httpMethod = 'PUT'
        }
        var url = '/api' + $location.$$path;
        $http({
            method: httpMethod,
            url: url,
            data: $scope.formData
        }).success(function(response, status) {
            if ($scope.isNew) {

            } else {
                var currentPath = $location.$$path;
                var pathArr = currentPath.split('/');
                pathArr.pop();
                var nextPath = pathArr.join('/');
                $location.path(nextPath);
            }
        }).error(function(err, status) {

        });
    }
});

kuroApp.controller('TaskFormCtrl', function($scope, $http, $routeParams, $location, StorageService, TaskService) {
    $scope.formData = {};
    $scope.isNew = true;
    if (typeof($routeParams.taskId) !== 'undefined') {
        $scope.taskId = $routeParams.taskId;
        $http({
            method: 'GET',
            url: '/api/task/' + $scope.taskId
        }).success(function(data, status, headers, config) {
            $scope.task = data;
            $scope.formData = $scope.task;
            $scope.isNew = false;
        }).error(function(data, status) {
            
        });
    }
    $scope.submitForm = function() {
        var httpMethod;
        if ($scope.isNew) {
            httpMethod = 'POST'
        } else {
            httpMethod = 'PUT'
        }
        var url = '/api' + $location.$$path;
        $http({
            method: httpMethod,
            url: url,
            data: $scope.formData
        }).success(function(response, status) {
            if ($scope.isNew) {

            } else {
                var currentPath = $location.$$path;
                var pathArr = currentPath.split('/');
                pathArr.pop();
                var nextPath = pathArr.join('/');
                $location.path(nextPath);
            }
        }).error(function(err, status) {

        });
    }
});

kuroApp.controller('ErrorCtrl', function($scope, $location) {
    var wordingMap = {
        '/unauthorize': 'You are not authorized',
        '/error': 'Something went wrong'
    }
    if (typeof(wordingMap[$location.$$path]) !== 'undefined') {
        $scope.wording = wordingMap[$location.$$path];
    } else {
        $scope.wording = wordingMap['/error'];
    }
});