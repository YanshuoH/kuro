var mongoose = require('mongoose');
var TaskModel = mongoose.model('TaskModel');
var ProjectModel = mongoose.model('ProjectModel');
/*
 * RESTful API
 */
exports.name = function (req, res) {
  res.json({
    name: 'Bob'
  });
};

exports.projectLoad = function(req, res, next, id) {
    ProjectModel.load(id.toString(), function(err, project) {
        if (err) {
            return next(err);
        } else if (!project) {
            return next(new Error('Failed to load Project ' + id));
        }
        req.project = project;
        next();
    });
}

exports.taskLoad = function(req, res, next, id) {
    TaskModel.load(id.toString(), function(err, task) {
        if (err) {
            return next(err);
        } else if (!task) {
            return next(new Error('Failed to load Task ' + id));
        }
        req.task = task;
        next();
    });
}

exports.taskShow = function(req, res) {
    var task = req.task;
    res.json(task);
}

exports.taskList = function(req, res) {
    // TODO, dispatch by project id
    // TODO, check the identity
    // TODO, only return title, description...except media sort of big thing
    TaskModel.listToJson({}, function(err, list) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.json(list);
        }
    });
}

exports.taskEditor = function(req, res) {
    res.send(true);
}