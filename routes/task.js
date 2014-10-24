var mongoose = require('mongoose');
var TaskModel = mongoose.model('TaskModel');

/*
 * @param taskId
 *
 * When :taskId detected in url, load and fetch task in req
 */
exports.load = function(req, res, next, id) {
    TaskModel.load(id, function(err, task) {
        if (err) {
            return next(err);
        } else if (!task) {
            return next(new Error('Failed to load Task ' + id));
        }
        req.task = task;
        next();
    });
}

/*
 * @path('/api/task/:taskId')
 *
 * Return JSON task
 */
exports.show = function(req, res) {
    var task = req.task;
    res.json(task);
}

/*
 * @path(/api/project/:projectId/taskboard)
 *
 * Return JSON tasks
 */
exports.listByProject = function(req, res) {

    // TODO, only return title, description...except media sort of big thing
    TaskModel.loadByProjectId(req.project._id.toString(), function(err, list) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.json(list);
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