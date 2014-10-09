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
