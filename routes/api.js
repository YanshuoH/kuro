var mongoose = require('mongoose');
var TaskModel = mongoose.model('TaskModel');

/*
 * RESTful API
 */
exports.name = function (req, res) {
  res.json({
    name: 'Bob'
  });
};


exports.taskLoad = function(req, res, next, id) {
    var taskId = req.params.taskId.toString()
    TaskModel.load(taskId, function(err, task) {
        if (err) {
            return next(err);
        } else if (!task) {
            return next(new Error('Failed to load Task ' + taskId));
        }
        req.task = task;
        next();
    });
}

exports.task = function(req, res) {
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