var mongoose = require('mongoose');

var ProjectModel = mongoose.model('ProjectModel');

exports.load = function(req, res, next, id) {
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

exports.show = function(req, res) {
    var project = req.project;
    res.json(project);
}

/**
 * Return an array of projects by userId
 */
exports.listByIds = function(req, res) {
    var options = {
        criteria: {
            '_id': {
                $in: req.user.project
            }
        }
    }
    ProjectModel.list(options, function(err, list) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.json(list);
        }
    });
}

exports.editor = function(req, res) {
    res.send(true);
}
