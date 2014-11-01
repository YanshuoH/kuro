var async = require('async');

var mongoose = require('mongoose');
var TaskModel = mongoose.model('TaskModel');
var ProjectModel = mongoose.model('ProjectModel');

exports.loadTaskFetchProject = function(taskId, cb) {
    async.waterfall([
        function(callback) {
            var options = {};
            TaskModel.load(taskId, options, function(err, task) {
                if (err) {
                    callback(err);
                } else if (!task) {
                    callback(new Error('Failed to load Task ' + taskId));
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