var mongoose = require('mongoose');
var TaskModel = mongoose.model('TaskModel');
var ProjectModel = mongoose.model('ProjectModel');
/*
 * @param taskId
 *
 * When :taskId detected in url, load and fetch task in req
 * Fetch parent project info into task data, only return project fields in criteria
 */
exports.load = function(req, res, next, id) {
    var options = {};
    TaskModel.load(id, options, function(err, task) {
        if (err) {
            return next(err);
        } else if (!task) {
            return next(new Error('Failed to load Task ' + id));
        }
        var projectOptions = {
            select: {
                fiedls: 'title, description, ref'
            }
        };
        ProjectModel.load(task.projectId.toString(), projectOptions, function(err, project) {
            if (err) {
                return next(err);
            } else if (!project) {
                return next(new Error('Failed to fetch Project ' + task.project.toString() + ' from Task ' + task._id));
            }
            req.task = task;
            req.task.project = project;
            next();
        });
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
    var options = {};
    // TODO, only return title, description...except media sort of big thing
    TaskModel.loadByProjectId(req.project._id.toString(), options, function(err, list) {
        console.log(req.project);
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