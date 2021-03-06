var config = require('../config/config');
var utils = require(config.path.lib + '/utils');
var async = require('async');

var mongoose = require('mongoose');
var TaskModel = mongoose.model('TaskModel');
var ProjectModel = mongoose.model('ProjectModel');

/*
 * @param taskShortId Integer
 * @param projectId ObjectId
 */
exports.loadByShortId = function(taskShortId, projectId, cb) {
    async.waterfall([
        function(callback) {
            var options = {};
            TaskModel.loadByShortId(taskShortId, projectId, options, function(err, task) {
                if (err) {
                    callback(err);
                } else if (!task) {
                    callback({
                        status: 204,
                        message: 'Failed to load task by shortId ' + taskShortId
                   });
                } else {
                    callback(null, task);
                }
            });
        }
    ], cb);
}

/*
 * @param TaskModel task
 * @param Object options - limit the field
 *
 * return TaskModel task 
 */
exports.fetchActivityToTask = function(task, options) {
    var changes = {};
    for (var i=0; i<task.activity.length; i++) {
        var activity = task.activity[i];

        if (typeof(options) !== 'undefined' && typeof(options.selectField) !== 'undefined' && options.selectField.length > 0) {
            var existCheck = utils.checkPropertiesExist(options.selectField, activity.content);
            if (!existCheck) {
                continue;
            }
        }

        if (activity.type === 'comment') {
            continue;
        }
        changes = utils.mergeObj(changes, activity.content);
    }

    return utils.overrideObj(task, changes);
}

/*
 * @param Array[TaskModel] tasks
 * 
 * return Array[TaskModel] tasks
 */
exports.fetchActivityToTaskList = function(tasks, options) {
    for (var i=0; i<tasks.length; i++) {
        tasks[i] = exports.fetchActivityToTask(tasks[i], options);
    }

    return tasks;
}


exports.loadTaskFetchProject = function(taskShortId, projectId, cb) {
    async.waterfall([
        function(callback) {
            exports.loadByShortId(taskShortId, projectId, function(err, task) {
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


/**
 * @param ObjectId projectId
 * @param String   alias      alias name to find by
 * @param ObjectId aliasId    aliasId to find by
 *
 * cb (err, tasks)
 */
exports.loadByProjectAndAlias = function(projectId, alias, aliasId, cb) {
    var options = {
        criteria: {}
    };
    options.criteria[alias] = aliasId;
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
    task.date.updated = Date.now();
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

exports.updateActivity = function(formData, task, callback) {
    task.activity.push(formData);
    exports.save(task, callback);
}