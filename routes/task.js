var mongoose = require('mongoose');
var TaskModel = mongoose.model('TaskModel');


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

exports.show = function(req, res) {
    var task = req.task;
    res.json(task);
}

exports.list = function(req, res) {
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

exports.editor = function(req, res) {
    res.send(true);
}