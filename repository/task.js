var config = require('../config/config');
var utils = require(config.path.lib + '/utils');
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

exports.jsonListByProjectFetch = function(projectId, cb) {
    var options = {};
    // TODO, only return title, description...except media sort of big thing
    TaskModel.loadByProjectId(projectId, options, cb);
}

/*
 * Maybe this part shall called entity/manager
 */
exports.save = function(task, callback) {
    // task.date.updated = Date.now();
    task.save(callback);
}

exports.create = function(req, callback) {
    var ids = {
        creatorId: req.user._id,
        projectId: req.project._id
    }
    var data = utils.mergeObj(req.body, ids);

    async.waterfall([
        function(taskCallback) {
            var task = new TaskModel(data);
            exports.save(task, function(err) {
                if (err) {
                    callback(err);
                } else {
                    taskCallback(null, task);
                }
            });
        }
    ], callback);
}

exports.update = function(req, callback) {
    var task =req.task;
    var formData = req.body;
    async.waterfall([
        function(taskCallback) {
            task.update(formData, function(err) {
                if (err) {
                    taskCallback(err);
                } else {
                    taskCallback(null, task)
                }
            });
        }
    ], callback);
}