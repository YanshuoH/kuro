var config = require('../config/config');
var TaskRepository = require(config.path.repository + '/task');


/*
 * @param taskShortId
 *
 * When :taskShortId detected in url, load and fetch task in req
 * Fetch parent project info into task data, only return project fields in criteria
 */
exports.loadByShortId = function(req, res, next, id) {
    var projectId = req.project._id;
    TaskRepository.loadTaskFetchProject(id, projectId, function(err, task) {
        if (err) {
            return next(err);
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
            console.log(err);
            res.send(err);
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
            res.send(err);
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
            res.send(err);
        } else {
            res.json(task);
        }
    });
}