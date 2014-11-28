'use strict';

/* Services */
var kuroApp = angular.module('Kuro');

kuroApp.factory('navbarData', function() {
    var data = {
        showTaskboard: false,
        hideProjectListLong: false
    };

    return {
        getShowTaskboard: function() {
            return data.showTaskboard;
        },
        setShowTaskboard: function(show) {
            data.showTaskboard = show;
        },
        getHideProjectListLong: function() {
            return data.hideProjectListLong;
        },
        setHideProjectListLong: function(hide) {
            data.hideProjectListLong = hide;
        }
    };
})

kuroApp.service('urlParserService', function() {
    return {
        getProjectId: getProjectId
    }

    function getProjectId(url) {
        var match = url.match(/\/project\/(\d+)/);

        if (match && match.length > 0) {
            return url.match(/\/project\/(\d+)/)[1];
        }
        return undefined;
    }
});

kuroApp.service('taskboardService', function() {
    var priorityMapping = {
        '0': 'low',
        '1': 'normal',
        '2': 'urgent'
    };

    var statusMapping = {
        '0': 'Todo',
        '1': 'QA',
        '2': 'Done'
    }

    var iteratePriority = function(task, grid) {
        var priority = priorityMapping[task.priority.toString()];
        if (typeof(grid[priority]) === 'undefined') {
            grid[priority] = {};
        }
        iterateStatus(task, grid[priority]);
    }

    var iterateStatus = function(task, subGrid) {
        var status = statusMapping[task.status.toString()];
        if (typeof(subGrid[status]) === 'undefined') {
            subGrid[status] = [task];
        } else {
            subGrid[status].push(task);
        }
    }

    var generateTaskboardGrid = function(tasks) {
        var grid = {};
        // two level: priority/late, status
        for (var i=0; i<tasks.length; i++) {
            var task = tasks[i];
            iteratePriority(task, grid);
        }

        return grid;
    }

    return {
        generateTaskboardGrid: generateTaskboardGrid
    }
});

kuroApp.service('userApiService', function($http, $q) {
    return {
        signin: signin,
        signup: signup,
        signout: signout
    };

    function signin(formData) {
        var request = $http({
            method: 'POST',
            url: '/api/user/signin',
            data: formData
        });

        return request.then(handleSuccess, handleError);
    }

    function signup(formData) {
        var request = $http({
            method: 'POST',
            url: '/api/user/create',
            data: formData
        });

        return request.then(handleSuccess, handleError);
    }

    function signout() {
        var request = $http({
            method: 'GET',
            url: '/api/user/signout'
        });

        return request.then(handleSuccess, handleError);
    }

    // Private
    function handleError(response, status) {
        if (!angular.isObject(response.data) || !response.data.error) {
            console.log(response.data);
            return $q.reject("An unknown error occurred");
        }

        // TODO: location redirect to error page
        // Or render error content
        // Two type of error: 500, failed to load by id
        // Error response with status code
    }

    // Private
    function handleSuccess(response) {
        return response.data;
    }

});

// http://www.bennadel.com/blog/2612-using-the-http-service-in-angularjs-to-make-ajax-requests.htm
kuroApp.service('apiService', function($http, $q) {
    return {
        getTask: getTask,
        createTask: createTask,
        putTask: putTask,
        getTaskList: getTaskList,
        getProject: getProject,
        createProject: createProject,
        putProject: putProject,
        getProjectList: getProjectList,
        addUserToProject: addUserToProject,
        getUserInfo: getUserInfo
    };

    function getTask(projectShortId, taskShortId) {
        var request = $http({
            method: 'GET',
            url: '/api/project/' + projectShortId + '/task/' + taskShortId
        });

        return request.then(handleSuccess, handleError);
    };

    function createTask(formData, projectShortId) {
        var request = $http({
            method: 'POST',
            url: '/api/project/' + projectShortId + '/task/create',
            data: formData
        });

        return request.then(handleSuccess, handleError);
    }

    function putTask(formData, projectShortId, taskShortId) {
        var request = $http({
            method: 'PUT',
            url: '/api/project/' + projectShortId + '/task/' + taskShortId + '/edit',
            data: formData
        });

        return request.then(handleSuccess, handleError);
    }

    function getTaskList(projectShortId) {
        var request = $http({
            method: 'GET',
            url: '/api/project/' + projectShortId + '/taskboard'
        });

        return request.then(handleSuccess, handleError);
    }

    function getProject(projectShortId) {
        var request = $http({
            method: 'GET',
            url: '/api/project/' + projectShortId
        });

        return request.then(handleSuccess, handleError);
    }

    function createProject(formData) {
        var request = $http({
            method: 'POST',
            url: '/api/project/create',
            data: formData
        });

        return request.then(handleSuccess, handleError);
    }

    function putProject(formData, projectShortId) {
        var request = $http({
            method: 'PUT',
            url: '/api/project/' + projectShortId + '/edit',
            data: formData
        });

        return request.then(handleSuccess, handleError);
    }

    function getProjectList() {
        var request = $http({
            method: 'GET',
            url: '/api/project'
        });

        return request.then(handleSuccess, handleError);
    }

    function addUserToProject(formData, projectShortId) {
        var request = $http({
            method: 'POST',
            url: '/api/project/' + projectShortId + '/user/add',
            data: formData
        });

        return request.then(handleSuccess, handleError);
    }

    function getUserInfo() {
        var request = $http({
            method: 'GET',
            url: '/api/user/info'
        });

        return request.then(handleSuccess, handleError);
    }
    // Private
    function handleError(response, status) {
        if (!angular.isObject(response.data) || !response.data.error) {
            console.log(response);
            return $q.reject("An unknown error occurred");
        }

        // TODO: location redirect to error page
        // Or render error content
        // Two type of error: 500, failed to load by id
        // Error response with status code
    }

    // Private
    function handleSuccess(response) {
        return response.data;
    }
})
