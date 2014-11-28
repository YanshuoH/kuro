'use strict';

var kuroApp = angular.module('Kuro');


kuroApp.controller('BoardCtrl', function(
    $scope,
    $http,
    $location,
    $routeParams,
    $timeout,
    apiService,
    urlParserService,
    taskboardService,
    navbarData) {
    /*
     * Begining of controller
     */
    $scope.projects = [];
    $scope.projectId;
    $scope.showTaskboardDelay = 500;
    $scope.showTaskboard = navbarData.getShowTaskboard();
    $scope.hideProjectListLong = navbarData.getHideProjectListLong();

    $scope.priorityData = ['urgent', 'normal', 'low'];
    $scope.statusData = ['Todo', 'QA', 'Done'];

    // Syn with navbarData
    $scope.$watch(function () { return navbarData.getShowTaskboard(); }, function(showTaskboard) {
        $scope.showTaskboard = showTaskboard;
    });

    $scope.$watch(function() { return navbarData.getHideProjectListLong(); }, function(hideProjectListLong) {
        $scope.hideProjectListLong = navbarData.getHideProjectListLong();
    });

    if (typeof($routeParams.projectId) !== 'undefined') {
        navbarData.setShowTaskboard(true);
        navbarData.setHideProjectListLong(true);
        $scope.projectId = $routeParams.projectId;
        apiService.getTaskList($scope.projectId)
            .then(function(tasks) {
                $scope.tasks = taskboardService.generateTaskboardGrid(tasks);
                console.log($scope.tasks);
          });
    }

    $scope.$on('$locationChangeStart', function(event, next, current) {
        // project list -> taskboard : get project id
        $scope.projectId = urlParserService.getProjectId(next);
        if ($scope.projectId && next.indexOf('taskboard') > -1) {
            $scope.showTaskboardFunc($scope.projectId);
            apiService.getTaskList($scope.projectId)
              .then(function(tasks) {
                $scope.tasks = taskboardService.generateTaskboardGrid(tasks);
              });
        }
    });

    apiService.getProjectList()
        .then(function(projects) {
            $scope.projects = projects;
        });

    $scope.showTaskboardFunc = function(projectId) {
        navbarData.setHideProjectListLong(true);
        $location.path('/project/' + projectId + '/taskboard', false);

        $timeout(function() {
            navbarData.setShowTaskboard(true);
        }, $scope.showTaskboardDelay);

    }
    $scope.createProject = function() {
        $location.path('/project/create');
    }
})

kuroApp.controller('ProjectCtrl', function($scope, $http, $location, $routeParams, apiService) {
    $scope.currentHash = '';
    $scope.projectId = $routeParams.projectId;

    $scope.changeHash = function(hash) {
        $scope.currentHash = hash;
        $location.hash(hash);
    };

    apiService.getProject($scope.projectId)
        .then(function(project) {
            console.log(project)
            $scope.project = project;
        })

    $scope.formData = {};
    $scope.addUserSubmitForm = function() {
        apiService.addUserToProject($scope.formData, $scope.projectId)
            .then(function(user) {
                $scope.project.users.push(user);
            });
    }
});

kuroApp.controller('ProjectFormCtrl', function($scope, $http, $routeParams, $location, apiService) {
    $scope.projectId = $routeParams.projectId;
    $scope.formData = {}
    $scope.isNew = true;
    if (typeof($routeParams.projectId) !== 'undefined') {
        apiService.getProject($scope.projectId)
            .then(function(project) {
                $scope.project = project;
                $scope.formData = $scope.project;
                $scope.isNew = false;
            });
    }

    $scope.submitForm = function() {
        if ($scope.isNew) {
            apiService.createProject($scope.formData)
                .then(function(response) {
                    console.log(response);
                })
        } else {
            apiService.putProject($scope.formData, $scope.projectId)
                .then(function(response) {
                    console.log(response);
                });
        }
    }
})