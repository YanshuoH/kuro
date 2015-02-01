'use strict';

var appName = document.querySelector('html').getAttribute('ng-app')

/* Services */
var kuroApp = angular.module(appName);

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

kuroApp.factory('errorData', function() {
    // Default
    var errorContent = {
        status: 200,
        message: ''
    };

    var modalErrorContent = {
        status: 200,
        message: ''
    };

    return {
        getErrorContent: function() {
            return errorContent;
        },
        setErrorContent: function(status, message) {
            errorContent = {
                status: status,
                message: message
            };
        },
        setModalErrorContent: function(status, message) {
            modalErrorContent = {
                status: status,
                message: message
            }
        },
        getModalErrorContent: function() {
            return modalErrorContent;
        },
        clear: function() {
            modalErrorContent = {
                status: 200,
                message: ''
            }
        }
    };
})

kuroApp.factory('Auth', function(userApiService) {
    var user;

    return {
        setUser: setUser,
        getUser: getUser,
        loginCheck: loginCheck
    }

    function setUser(aUser) {
        user = aUser;
    }

    function getUser() {
        return user;
    }

    function loginCheck(callback) {
        userApiService.loginCheck()
            .then(callback);
    }
})

kuroApp.service('urlParserService', function() {
    return {
        getProjectId: getProjectId,
        getTaskParamFromHash: getTaskParamFromHash,
        isOnlyHashChange: isOnlyHashChange
    }

    function parseQuery(query) {
        var a = query.split('&');
        if (a == '') {
            return {};
        }
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p=a[i].split('=', 2);
            if (p.length == 1) {
                b[p[0]] = '';
            }
            else
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
        }
        return b;
    }

    function getProjectId(url) {
        var match = url.match(/\/project\/(\d+)/);

        if (match && match.length > 0) {
            return url.match(/\/project\/(\d+)/)[1];
        }
        return undefined;
    }

    function getTaskParamFromHash(hash) {
        var params = parseQuery(hash);
        return params;
    }

    function isOnlyHashChange(next, current) {
        var nextWithoutHash = next;
        var currentWithoutHash = current;
        if (next.indexOf('#') > -1) {
            nextWithoutHash = next.substring(0, next.indexOf('#'));
        }

        if (current.indexOf('#') > -1) {
            currentWithoutHash = current.substring(0, current.indexOf('#'));
        }

        if (nextWithoutHash === currentWithoutHash) {
            return true;
        }

        return false;
    }
});

kuroApp.service('projectService', function() {
    return {
        searchProjectByShortId: searchProjectByShortId
    };

    function searchProjectByShortId(projectShortId, list) {
        for (var i=0; i<list.length; i++) {
            if (list[i].shortId.toString() === projectShortId.toString()) {
                return list[i];
            }
        }

        return null;
    }
})

kuroApp.service('taskboardService', function() {

    var getKeyByValue = function(obj, value) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) ) {
                 if (obj[prop] === value)
                     return prop;
            }
        }
    };

    var generateStatusMapping = function(statusData) {
        var statusMapping = {};
        for (var i=0; i<statusData.length; i++) {
            statusMapping[statusData[i]._id] = statusData[i].label;
        }

        return statusMapping;
    }

    var generatePriorityMapping = function(priorityData) {
        var priorityMapping = {};
        for (var j=0; j<priorityData.length; j++) {
            priorityMapping[priorityData[j]._id] = priorityData[j].label;
        }

        return priorityMapping;
    }

    var insertIntoGrid = function(grid, task, statusMapping, priorityMapping) {
        grid[priorityMapping[task.priority.toString()]]
            [statusMapping[task.status.toString()]].push(task);
    };

    var initTaskboardGrid = function(statusMapping, priorityMapping) {
        var grid = {};

        for (var priority in priorityMapping) {
            grid[priorityMapping[priority]] = {};
            for (var status in statusMapping) {
                grid[priorityMapping[priority]][statusMapping[status]] = [];
            }
        }

        return grid;
    };

    var generateTaskboardGrid = function(tasks, statusMapping, priorityMapping) {
        var grid = initTaskboardGrid(statusMapping, priorityMapping);
        // two level: priority/late, status
        for (var i=0; i<tasks.length; i++) {
            var task = tasks[i];
            insertIntoGrid(grid, task, statusMapping, priorityMapping);
        }

        return grid;
    };

    var generateUpdateData = function(status, priority, statusMapping, priorityMapping) {
        return {
            priority: getKeyByValue(priorityMapping, priority),
            status: getKeyByValue(statusMapping, status)
        };
    };

    // Find task location and remove it, then push the new task to new location
    var updateGridByTaskId = function(task, grid) {
        for (var priority in grid) {
            for (var status in grid[priority]) {
                for (var i=0; i<grid[priority][status].length; i++) {
                    if (task._id === grid[priority][status][i]._id) {
                        grid[priority][status].splice(i, 1);
                        grid[task.priorityLabel][task.statusLabel].push(task);
                        return grid;
                    }
                }
            }
        }

        return grid;
    };

    var generatePriorityList = function(priorityData) {
        return priorityData.sort(function(a, b) {
            return b.weight- a.weight;
        });
    };

    var generateStatusList = function(statusData) {
        return statusData.sort(function(a, b) {
            return a.weight - b.weight;
        });
    };

    return {
        generateTaskboardGrid: generateTaskboardGrid,
        generateUpdateData: generateUpdateData,
        updateGridByTaskId: updateGridByTaskId,
        generatePriorityList: generatePriorityList,
        generateStatusList: generateStatusList,
        generatePriorityMapping: generatePriorityMapping,
        generateStatusMapping: generateStatusMapping
    };
});

kuroApp.service('taskService', function() {
    return {
        retrieveComments: retrieveComments,
        addActivity: addActivity,
        taskDiff: taskDiff,
        mapFields: mapFields,
        getFieldsLabel: getFieldsLabel
    };

    function retrieveComments(task) {
        var comments = [];
        for (var i=0; i<task.activity.length; i++) {
            if (task.activity[i].type === 'comment') {
                comments.push(task.activity[i]);
            }
        }
        return comments;
    }

    function addActivity(type, activity, task, user) {
        var activityModel = {
            type: type,
            user: {
                _id: user._id,
                username: user.username
            },
            at: Date.now()
        };
        activityModel.content = activity;

        task.activity.push(activityModel);
        if (type === 'comment') {
            task.comments.push(activityModel);
        }

        // Merge mapping fields to task
        for (var prop in activity.content) {
            if (['status', 'priority'].indexOf(prop) > -1) {
                task[prop] = activity.content[prop];
            }
        }

        return task;
    }

    function taskDiff(oldTask, newTask) {
        var content = {};
        var ignoreFields = ['activity', 'date', 'comments'];
        for (var prop in newTask) {
            if (ignoreFields.indexOf(prop) > -1) {
                continue;
            }
            if (typeof(oldTask[prop]) === 'undefined') {
                content[prop] = newTask[prop];
                continue;
            }

            if (typeof(newTask[prop]) === 'object') {
                if (JSON.stringify(oldTask[prop]) !== JSON.stringify(newTask[prop])) {
                    content[prop] = newTask[prop];
                }
                continue;
            }

            if (newTask[prop] !== oldTask[prop]) {
                content[prop] = newTask[prop];
                continue;
            }
        }

        return content;
    }

    function getFieldsLabel(task, statusList, priorityList) {
        // @var Array
        var statusObj = statusList.filter(function(status) {
            return status._id === task.status;
        });

        // @var Array
        var priorityObj = priorityList.filter(function(priority) {
            return priority._id === task.priority;
        });

        task.statusLabel = statusObj[0].label;
        task.priorityLabel = priorityObj[0].label;
    }

    function getFieldId(label, fieldData) {
        var targetObj = fieldData.filter(function(obj) {
            return label === obj.label;
        });
        return targetObj[0]._id;
    }

    function mapFields(content, statusList, priorityList) {
        var fieldsToMap = ['status', 'priority'];
        var fieldData = null;
        for (var i=0; i<fieldsToMap.length; i++) {
            if (typeof(content[fieldsToMap[i] + 'Label']) !== 'undefined') {
                switch(fieldsToMap[i]) {
                    case 'status':
                        fieldData = statusList;
                        break;
                    case 'priority':
                        fieldData = priorityList;
                        break;
                }
                content[fieldsToMap[i]] = getFieldId(content[fieldsToMap[i] + 'Label'], fieldData);
            }
        }
        return content;
    }
})


kuroApp.service('userApiService', function($http, $q) {
    return {
        signin: signin,
        signup: signup,
        signout: signout,
        loginCheck: loginCheck
    };

    function loginCheck() {
        var request = $http({
            method: 'GET',
            url: '/api/user/login_check'
        });

        return request.then(handleSuccess, handleError);
    }

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
            return $q.reject(response.data);
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
kuroApp.service('apiService', function($http, $q, errorData) {
    return {
        getTask: getTask,
        createTask: createTask,
        putTask: putTask,
        putTaskActivity: putTaskActivity,
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

    function putTaskActivity(formData, projectShortId, taskShortId) {
        var request = $http({
            method: 'PUT',
            url: '/api/project/' + projectShortId + '/task/' + taskShortId + '/edit/activity',
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
        console.log(response);
        if (!angular.isObject(response.data) || !response.data.error) {
            if (response.status == 500 || response.status == 401) {
                if (/\/api\/project\/.*\/task\//g.exec(response.config.url)) {
                    errorData.setModalErrorContent(response.status, response.data.message);
                } else {
                    errorData.setErrorContent(response.status, response.data.message);
                }
            }
            return $q.reject(response.data.message);
        }

        // TODO: location redirect to error page
        // Or render error content
        // Two type of error: 500, failed to load by id
        // Error response with status code
    }

    // Private
    function handleSuccess(response) {
        console.log(response);
        // for task modal
        if (response.status == 204) {
            if (/\/api\/project\/.*\/task\//g.exec(response.config.url)) {
                errorData.setModalErrorContent(response.status, 'No content found');
            } else {
                errorData.setErrorContent(response.status, 'No content found');
            }
            return $q.reject(response.data.message);
        }

        return response.data;
    }
})
