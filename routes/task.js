var config = require('../config/config');
var TaskRepository = require(config.path.repository + '/task');


/*
 * @param taskShortId
 *
 * When :taskShortId detected in url, load and fetch task in req
 * Fetch parent project info into task data, only return project fields in criteria
 */
exports.loadByShortId = function(req, res, next, id) {
    TaskRepository.loadTaskFetchProject(id, function(err, task) {
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
 * @path(/api/task/:taskId/edit)
 *
 * GET/PUT/POST
 */
exports.editor = function(req, res) {
    res.send(true);
}