var config = require('../config/config');

var errorHandler = require(config.path.lib + '/errorHandler');

var TaskRepository = require(config.path.repository + '/task');


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
    TaskRepository.loadTaskFetchProject(id, projectId, function(err, task) {
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
    var task = req.task;
    // Change mongoose document to plain object
    // in order to insert project json in response
    task = task.toObject();
    task.project = req.task.project;
    res.json(task);
}

/*
 * @path(/api/project/:projectId/taskboard)
 *
 * Return JSON tasks
 */
exports.listByProject = function(req, res) {
    var options = {};
    // TODO, only return title, description...except media sort of big thing
    TaskRepository.listByProject(req.project._id.toString(), function(err, tasks) {
        if (err) {
            return errorHandler.handle(res, err);
        } else {
            res.json(tasks);
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