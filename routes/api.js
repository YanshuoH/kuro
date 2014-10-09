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

exports.taskList = function(req, res) {
    // TODO, dispatch by project id
    // TODO, check the identity
    TaskModel.listToJson({}, function(err, list) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.json(list);
        }
    });
}