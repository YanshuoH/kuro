'use strict';

var kuroApp = angular.module('Kuro');


kuroApp.controller('BoardCtrl', function(
    $scope,
    $http,
    $location,
    $routeParams,
    $timeout,
    $modal,
    $modalStack,
    apiService,
    urlParserService,
    taskboardService,
    navbarData) {
    /*
     * Begining of controller
     */
    $scope.projects = [];
    $scope.projectId;
    $scope.tasks = [];
    $scope.showTaskboardDelay = 500;
    $scope.showTaskboard = navbarData.getShowTaskboard();
    $scope.hideProjectListLong = navbarData.getHideProjectListLong();
    $scope.isDrag = false;

    $scope.priorityData = ['urgent', 'normal', 'low'];
    $scope.statusData = ['Todo', 'QA', 'Done'];

    // Syn with navbarData
    $scope.$watch(function () { return navbarData.getShowTaskboard(); }, function(showTaskboard) {
        $scope.showTaskboard = showTaskboard;
    });

    $scope.$watch(function() { return navbarData.getHideProjectListLong(); }, function(hideProjectListLong) {
        $scope.hideProjectListLong = navbarData.getHideProjectListLong();
    });

    // Dispatch view
    if (typeof($routeParams.projectId) !== 'undefined') {
        navbarData.setShowTaskboard(true);
        navbarData.setHideProjectListLong(true);
        $scope.projectId = $routeParams.projectId;
        apiService.getTaskList($scope.projectId)
            .then(function(tasks) {
                $scope.tasks = taskboardService.generateTaskboardGrid(tasks);
          });
    }

    $scope.$on('$locationChangeStart', function(event, next, current) {
        if (urlParserService.isOnlyHashChange(next, current)) {
            // do nothing
        } else {
            // project list -> taskboard : get project id
            $scope.projectId = urlParserService.getProjectId(next);
            if ($scope.projectId !== 'undefined' && next.indexOf('taskboard') > -1) {
                $scope.showTaskboardFunc($scope.projectId);
                apiService.getTaskList($scope.projectId)
                  .then(function(tasks) {
                    $scope.tasks = taskboardService.generateTaskboardGrid(tasks);
                  });
            }
        }
    });

    $scope.$on('$locationChangeSuccess', function(current, old) {
        $scope.shouldShowTaskModal($location.hash());
    });

    // If init page should show task modal
    $timeout(function() {
        $scope.shouldShowTaskModal($location.hash());
    }, 1000)
    

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

    };

    $scope.createProject = function() {
        $location.path('/project/create');
    };

    $scope.initDefaultGrid = function(arg1, arg2) {
        // priority case
        if (!arg2) {
            if (typeof($scope.tasks[arg1]) === 'undefined') {
                $scope.tasks[arg1] = [];
            }
        } else {
            if (typeof($scope.tasks[arg1][arg2]) === 'undefined') {
                $scope.tasks[arg1][arg2] = [];
            }
        }
    };

    $scope.addHash = function(hash, $event) {
        if (!$scope.isDrag) {
            $location.hash(hash);
        }
    }

    $scope.openTaskModal = function(taskId) {
        // Close opened modal
        // $modalStack.dismissAll();
        // If no modal opened
        if (!$modalStack.getTop()) {
            var modalInstance = $modal.open({
                templateUrl: 'taskModal',
                controller: 'TaskCtrl',
                size: 'lg'
            })
            // After close event
            modalInstance.result.then(
                function () {
                    // Submit
                    },
                function () {
                    // Close
                    // Clear hash
                    $location.hash('');
                }
            );
        }
    }

    $scope.shouldShowTaskModal = function(hash) {
        var hashParams = urlParserService.getTaskParamFromHash($location.hash());
        if (typeof(hashParams.taskId) !== 'undefined') {
            $scope.openTaskModal(hashParams.taskId);
        }
    }

    // If task modal should open
    // if ($location.hash() !== '') {
    //     $openModalFuncCalled = true;
    //     $scope.shouldShowTaskModal($location.hash());
    // }

    $scope.dropCallback = function(event, ui, priority, status) {
        // update task
        var putData = taskboardService.generateUpdateData(priority, status);
        apiService.putTask(putData, $scope.projectId, $scope.taskDragged.shortId)
            .then(function(response) {
                console.log(response);
            })
        $scope.isDrag = false;
    };

    $scope.dragStartCallback = function(event, ui, task) {
        $scope.taskDragged = task;
        $scope.isDrag = true;
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