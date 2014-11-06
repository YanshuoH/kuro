var async = require('async');

var mongoose = require('mongoose');
var TaskModel = mongoose.model('TaskModel');
var ProjectModel = mongoose.model('ProjectModel');


exports.loadByShortId = function(taskShortId, cb) {
    async.waterfall([
        function(callback) {
            var options = {};
            TaskModel.loadByShortId(taskShortId, options, function(err, task) {
                if (err) {
                    callback(err);
                } else if (!task) {
                    callback(new Error('Failed to load Task by shortId ' + taskShortId));
                } else {
                    callback(null, task);
                }
            })
        }
    ], cb);
}

exports.loadTaskFetchProject = function(taskShortId, cb) {
    async.waterfall([
        function(callback) {
            exports.loadByShortId(taskShortId, function(err, task) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, task);
                }
            });
        },
        function(task, callback) {
            var projectOptions = {
                select: {
                    fiedls: 'title, description, ref'
                }
            };
            ProjectModel.loadJson(task.projectId.toString(), projectOptions, function(err, project) {
                if (err) {
                    callback(err);
                } else if (!project) {
                    callback(new Error('Failed to load Project ' + task.projectId));
                } else {
                    task.project = project;
                    callback(null, task);
                }
            });
        }
    ], cb);
};

exports.listByProject = function(projectId, cb) {
    var options = {};
    // TODO, only return title, description...except media sort of big thing
    TaskModel.loadByProjectId(projectId, options, cb);
}

/*
 * Maybe this part shall called entity/manager
 */
exports.save = function(task, callback) {
    task.date.updated = Date.now();
    task.save(callback);
}