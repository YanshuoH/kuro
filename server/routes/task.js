var config = require('../config/config');
var async = require('async');

var errorHandler = require(config.path.lib + '/errorHandler');
var successHandler = require(config.path.lib + '/successHandler');

var TaskRepository = require(config.path.repository + '/task');
var ProjectRepository = require(config.path.repository + '/project');

/*
 * @param taskShortId
 *
 * When :taskShortId detected in url, load and fetch task in req
 * Fetch parent project info into task data, only return project fields in criteria
 */
exports.loadByShortId = function(req, res, next, id) {
    if (!req.isAuthenticated()) {
        return errorHandler.handle(res, {
            status: 401,
            message: 'Please login with your account'
        });
    }
    var projectId = req.project._id;
    TaskRepository.loadByShortId(id, projectId, function(err, task) {
        if (err) {
            return errorHandler.handle(res, err);
        }
        req.task = task;
        next();
    });
}

/*
 * @path('/api/task/:taskShortId')
 *
 * Return JSON task
 */
exports.show = function(req, res) {
    var task = TaskRepository.fetchActivityToTask(req.task);

    res.json(task);
}

/*
 * @path(/api/project/:projectId/taskboard)
 *
 * Return JSON {
 *     tasks: tasks,
 *     project: project
 * }
 */
exports.listByProject = function(req, res) {
    var options = {};
    // TODO, only return title, description...except media sort of big thing
    async.waterfall([
        function(callback) {
            TaskRepository.listByProject(req.project._id.toString(), function(err, tasks) {
                if (err) {
                    return errorHandler.handle(res, err);
                } else {
                    var options = {
                        selectField: ['title', 'status', 'priority']
                    };
                    callback(null, TaskRepository.fetchActivityToTaskList(tasks, options));
                }
            });
        },
        function(tasks, callback) {
            var fetchOptions = ['fetchStatus', 'fetchPriority'];
            ProjectRepository.fetch(req.project, fetchOptions, function(err, project) {
                if (err) {
                    return errorHandler.handle(res, err);
                } else {
                    callback(null, tasks, project);
                }
            });
        }
    ], function(err, tasks, project) {
        if (err) {
            return errorHandler.handle(res, err);
        } else {
            res.json({
                tasks: tasks,
                project: project
            });
        }
    });
}

/*
 * @path(/api/task/create)
 *
 * POST
 */
exports.create = function(req, res) {
    TaskRepository.create(req, function(err, task) {
        if (err) {
            return errorHandler.handle(res, err);
        } else {
            res.json(task);
        }
    });
}

/*
 * @path(/api/task/:taskId/edit)
 *
 * PUT
 */
exports.update = function(req, res) {
    TaskRepository.update(req, function(err, task) {
        if (err) {
            return errorHandler.handle(res, err);
        } else {
            res.json(task);
        }
    });
}

/*
 * @path(/api/project/:projectShortId/task/:taskShortId/edit/activity)
 *
 * PUT
 */
exports.updateActivity = function(req, res) {
    var formData = req.body;
    formData.user = {
        _id: req.user._id,
        username: req.user.username
    };
    formData.at = Date.now();
    TaskRepository.updateActivity(formData, req.task, function(err, task) {
        if (err) {
            return errorHandler.handle(res, err);
        } else {
            return successHandler.handle(res, 'task', 'update');
        }
    });
}