'use strict';

/* Services */
var kuroApp = angular.module('Kuro');

kuroApp.factory('StorageService', function() {
    return {
        get : function(key) {
            return angular.fromJson(localStorage.getItem(key));
        },
        set : function(key, data) {
            localStorage.setItem(key, angular.toJson(data));
        },
        remove : function(key) {
            localStorage.removeItem(key);
        },
        clear : function() {
            localStorage.clear();
        }
    };
});

kuroApp.factory('TaskService', function() {
    return {
        getById: function(tasks, taskId) {
            for (var i=0; i<tasks.length; i++) {
                if (tasks[i]._id.toString() === taskId.toString()) {
                    return tasks[i];
                }
            }
            return null;
        }
    }
});

// http://www.bennadel.com/blog/2612-using-the-http-service-in-angularjs-to-make-ajax-requests.htm
kuroApp.service('apiService', function($http, $q) {
    return {
        getTask: getTask,
        getTaskList: getTaskList
        // getProject: getProject,
        // getProjectList: getProjectList
    };

    function getTask(taskShortId) {
        var request = $http({
            method: 'GET',
            url: '/api/task/' + taskShortId
        });

        return request.then(handleSuccess, handleError);
    };

    function getTaskList(projectShortId) {
        var request = $http({
            method: 'GET',
            url: '/api/project/' + projectShortId + '/taskboard'
        });

        return request.then(handleSuccess, handleError);
    }

    // Private
    function handleError(response, status) {
        if (!angular.isObject(response.data) || !response.data.error) {
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
