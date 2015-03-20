'use strict';

var kuroApp = angular.module('Kuro');


kuroApp.controller('BoardCtrl', [
    '$scope',
    '$http',
    '$route',
    '$location',
    '$routeParams',
    '$timeout',
    '$modal',
    '$modalStack',
    'apiService',
    'urlParserService',
    'utilService',
    'projectService',
    'taskboardService',
    'navbarData',
    'routeState',
function(
    $scope,
    $http,
    $route,
    $location,
    $routeParams,
    $timeout,
    $modal,
    $modalStack,
    apiService,
    urlParserService,
    utilService,
    projectService,
    taskboardService,
    navbarData,
    routeState)
{
    /*
     * Begining of controller
     */
    $scope.routeState = routeState;
    $scope.projects = [];
    $scope.projectId;
    $scope.currentProject = null;
    $scope.tasks = [];
    $scope.showTaskboardDelay = 500;
    $scope.showTaskboard = navbarData.getShowTaskboard();
    $scope.hideProjectListLong = navbarData.getHideProjectListLong();
    $scope.showProjectForm = navbarData.getShowProjectForm();
    $scope.isDrag = false;

    // Syn with navbarData
    $scope.$watch(function () { return navbarData.getShowTaskboard(); }, function(showTaskboard) {
        $scope.showTaskboard = showTaskboard;
    });

    $scope.$watch(function() { return navbarData.getHideProjectListLong(); }, function(hideProjectListLong) {
        $scope.hideProjectListLong = navbarData.getHideProjectListLong();
    });

    $scope.$watch(function() { return navbarData.getShowProjectForm(); }, function(showProjectForm) {
        $scope.showProjectForm = showProjectForm;
    });

    $scope.handleTaskboardData = function(taskboardData) {
        $scope.currentProject = taskboardData.project;
        // object data for mapping
        $scope.priorityMapping = taskboardService.generatePriorityMapping($scope.currentProject.priorityData);
        $scope.statusMapping = taskboardService.generateStatusMapping($scope.currentProject.statusData);
        // taskboard grid
        $scope.tasks = taskboardService.generateTaskboardGrid(taskboardData.tasks, $scope.statusMapping, $scope.priorityMapping);
        // List sorted by weight
        $scope.priorityList = taskboardService.generatePriorityList($scope.currentProject.priorityData);
        $scope.statusList = taskboardService.generateStatusList($scope.currentProject.statusData);
    };

    $scope.showTaskboardFunc = function(projectId) {
        navbarData.setHideProjectListLong(true);
        $location.path('/project/' + projectId + '/taskboard', false);

        $timeout(function() {
            navbarData.setShowTaskboard(true);
        }, $scope.showTaskboardDelay);
    };

    $scope.showProjectFormFunc = function(projectId) {
        navbarData.setHideProjectListLong(true);
        $location.path('/project/' + projectId + '/edit', false);

        $timeout(function() {
            navbarData.setShowProjectForm(true);
        }, $scope.showTaskboardDelay);
    };
    // Dispatch view by route stage
    switch($scope.routeState) {
        case 'taskboard':
            navbarData.setShowTaskboard(true);
            navbarData.setHideProjectListLong(true);
            $scope.projectId = $routeParams.projectId;
            apiService.getTaskList($scope.projectId)
                .then($scope.handleTaskboardData);
            break;
        case 'project.edit':
            $scope.projectId = $routeParams.projectId;
            $scope.showProjectFormFunc($scope.projectId);
            break;
        default:
            // archive
            navbarData.setHideProjectListLong(false);
            navbarData.setShowTaskboard(false);
            navbarData.setShowProjectForm(false);
    }

    $scope.$on('$locationChangeStart', function(event, next, current) {
        var nextLocationPath = urlParserService.getLocationData(next).pathname;
        if (urlParserService.isOnlyHashChange(next, current)) {
            // do nothing
        } else {
            if ($route.routes['/project/:projectId/taskboard'].regexp.test(nextLocationPath)) {
                // taskboard
                $scope.projectId = urlParserService.getProjectId(next);
                $scope.showTaskboardFunc($scope.projectId);
                apiService.getTaskList($scope.projectId)
                  .then($scope.handleTaskboardData);
            } else if ($route.routes['/project/:projectId/edit'].regexp.test(nextLocationPath)) {
                // project edit form
                $scope.projectId = urlParserService.getProjectId(next);
                $scope.showProjectFormFunc($scope.projectId);
            } else {
                // archive
                navbarData.setShowTaskboard(false);
                navbarData.setHideProjectListLong(false);
                navbarData.setShowProjectForm(false);
            }
        }
    });

    $scope.$on('$locationChangeSuccess', function(current, old) {
        $scope.shouldShowTaskModal($location.hash());
    });

    // If init page should show task modal
    $timeout(function() {
        $scope.shouldShowTaskModal($location.hash());
    }, 1000);
    

    apiService.getProjectList()
        .then(function(projects) {
            $scope.projects = projects;
        });

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
    };

    $scope.openTaskModal = function(taskId) {
        // Close opened modal
        // $modalStack.dismissAll();
        // If no modal opened
        if (!$modalStack.getTop()) {
            var modalInstance = $modal.open({
                templateUrl: 'taskModal',
                controller: 'TaskCtrl',
                backdrop: false,
                backdropClass: 'kidding',
                size: 'lg',
                resolve: {
                    statusList: function() {
                        return $scope.statusList;
                    },
                    priorityList: function() {
                        return $scope.priorityList;
                    }
                }
            });
            // After close event
            modalInstance.result.then(
                function (task) {
                    if (task) {
                        $scope.tasks = taskboardService.updateGridByTaskId(task, $scope.tasks);
                    }
                },
                function () {
                    // Close
                }
            );

            modalInstance.result.finally(function(task) {
                $location.hash('');
            });
        }
    };

    $scope.shouldShowTaskModal = function(hash) {
        var hashParams = urlParserService.getTaskParamFromHash($location.hash());
        if (typeof(hashParams.taskId) !== 'undefined') {
            $scope.openTaskModal(hashParams.taskId);
        }
    };

    // If task modal should open
    // if ($location.hash() !== '') {
    //     $openModalFuncCalled = true;
    //     $scope.shouldShowTaskModal($location.hash());
    // }

    $scope.dropCallback = function(event, ui, priority, status) {
        // update task
        var putData = taskboardService.generateUpdateData(status, priority, $scope.statusMapping, $scope.priorityMapping);
        apiService.putTask(putData, $scope.projectId, $scope.taskDragged.shortId)
            .then(function(response) {
                console.log(response);
            })
        $scope.isDrag = false;
    };

    $scope.dragStartCallback = function(event, ui, task) {
        $scope.taskDragged = task;
        $scope.isDrag = true;
    };
}])

kuroApp.controller('ProjectCtrl', function($scope, $http, $location, $routeParams, apiService) {
    $scope.currentHash = '';
    $scope.projectId = $routeParams.projectId;

    $scope.changeHash = function(hash) {
        $scope.currentHash = hash;
        $location.hash(hash);
    };

    apiService.getProject($scope.projectId)
        .then(function(project) {
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

kuroApp.controller('ProjectFormCtrl', [
    '$scope',
    '$http',
    '$location',
    'apiService',
    'urlParserService',
function(
    $scope,
    $http,
    $location,
    apiService,
    urlParserService)
{
    /*
     * Begining of controller
     */
    $scope.projectId = urlParserService.getProjectId($location.path());
    $scope.formData = {};
    $scope.isNew = true;
    $scope.formHasMessage = false;
    $scope.formMessageType = 'alert-danger';

    if (typeof($scope.projectId) !== 'undefined') {
        var param = {
            fetchUser: 1,
            fetchStatus: 1,
            fetchPriority: 1
        }
        apiService.getProject($scope.projectId, param)
            .then(function(project) {
                $scope.project = project;
                $scope.formData = $scope.project;
                $scope.isNew = false;
            });
    }

    $scope.addToList = function(dataModel, alias) {
        var inputError = false;
        if (typeof(dataModel) === 'undefined' || dataModel.length === 0) {
            inputError = true;
            $scope.insertFormMessage('alert-info', 'Please enter a valide input');
        }
        switch(alias) {
            case 'priority':
                if (inputError) {
                    $scope.priorityHasError = true;
                } else {
                    $scope.priorityHasError = false;
                }
                addPriority(dataModel);
                break;
            case 'status':
                if (inputError) {
                    $scope.statusHasError = true;
                } else {
                    $scope.statusHasError = false;
                }
                addStatus(dataModel);
                break;
            case 'admin':
                // todo
                break;
            case 'user':
                // todo
                break;
        }

        function addPriority(dataModel) {
            var code = makeCode(dataModel);
            // make form data
            var createPriorityData = {
                label: dataModel,
                code: code,
                weight: 0
            };
            apiService.createPriorityToProject(createPriorityData, $scope.project.shortId)
                .then(function(priority) {
                    $scope.project.priorityData.push(priority);
                    $scope.project.priorityIds.push(priority._id);
                    $scope.addPriorityData = '';
                    $scope.insertFormMessage('alert-success', 'Priority added');
                });
        }

        function addStatus(dataModel) {
            var code = makeCode(dataModel);
            //make form data
            var createStatusData = {
                label: dataModel,
                code: code,
                weight: 0
            };
            apiService.createStatusToProject(createStatusData, $scope.project.shortId)
                .then(function(status) {
                    $scope.project.statusData.push(status);
                    $scope.project.statusIds.push(status._id);
                    $scope.addStatusData = '';
                    $scope.insertFormMessage('alert-success', 'Status added');
                });
        }

        // make status/priority code
        function makeCode(label) {
            var codeArr = dataModel.split(' ');
            var code = '';
            for (var i=0; i<codeArr.length; i++) {
                code += codeArr[i].substring(0, 1).toUpperCase();
            }

            return code;
        }
    };

    $scope.removeAdmin = function(adminId) {
        if ($scope.project.adminIds.indexOf(adminId) > -1) {
            var adminIds = angular.copy($scope.project.adminIds);
            adminIds.splice(adminIds.indexOf(adminId), 1);
            // make form data
            var putAdminIdsData = {
                adminIds: adminIds
            };
            apiService.putProject(putAdminIdsData, $scope.project.shortId)
                .then(function(response) {
                    $scope.project.admins = $scope.project.admins.filter(function(admin) {
                        return admin._id !== adminId;
                    });
                    $scope.adminIds = adminIds;
                    $scope.insertFormMessage('alert-success', 'Admin removed');
                }, function(err) {
                    if (err) {
                        switch (err.status) {
                            case 422:
                                $scope.insertFormMessage('alert-info', err.message);
                                break;
                            default:
                                $scope.insertFormMessage('alert-danger', err.message);
                        }
                    }
                });
        }
    };

    $scope.removePriority = function(priorityId) {
        if ($scope.project.priorityIds.indexOf(priorityId) > -1) {
            var priorityIds = angular.copy($scope.project.priorityIds);
            priorityIds.splice(priorityIds.indexOf(priorityId), 1);
            // make form data
            var putPriorityIdsData = {
                priorityData: priorityIds
            };
            apiService.putProject(putPriorityIdsData, $scope.project.shortId)
                .then(function(response) {
                    $scope.project.priorityData = $scope.project.priorityData.filter(function(priority) {
                        return priority._id !== priorityId;
                    });
                    $scope.project.priorityIds = priorityIds;
                    $scope.insertFormMessage('alert-success', 'Priority removed');
                }, function(err) {
                    if (err) {
                        switch (err.status) {
                            case 422:
                                $scope.insertFormMessage('alert-info', err.message);
                                break;
                            default:
                                $scope.insertFormMessage('alert-danger', err.message);
                        }
                    }
                });
        }
    };

    $scope.removeStatus = function(statusId) {
        if ($scope.project.statusIds.indexOf(statusId) > -1) {
            var statusIds = angular.copy($scope.project.statusIds);
            statusIds.splice(statusIds.indexOf(statusId), 1);

            var putStatusIdsData = {
                statusData: statusIds
            };

            apiService.putProject(putStatusIdsData, $scope.project.shortId)
                .then(function(response) {
                    $scope.project.statusData = $scope.project.statusData.filter(function(status) {
                        return status._id !== statusId;
                    });
                    $scope.project.statusIds = statusIds;
                    $scope.insertFormMessage('alert-success', 'Status removed')
                }, function(err) {
                    if (err) {
                        switch (err.status) {
                            case 422:
                                $scope.insertFormMessage('alert-info', err.message);
                                break;
                            default:
                                $scope.insertFormMessage('alert-danger', err.message);
                        }
                    }
                });
        }
    };

    $scope.initForm = function() {
        $scope.formHasMessage = false;
        $scope.formMessage = '';
    };

    $scope.insertFormMessage = function(type, content) {
        $scope.formHasMessage = true;
        $scope.formMessage = content;
        $scope.formMessageType = type;
    };

    $scope.submitForm = function() {
        if ($scope.isNew) {
            apiService.createProject($scope.formData)
                .then(function(response) {
                    console.log(response);
                });
        } else {
            apiService.putProject($scope.formData, $scope.projectId)
                .then(function(response) {
                    console.log(response);
                });
        }
    };
}]);