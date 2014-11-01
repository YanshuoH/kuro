var async = require('async');
var mongoose = require('mongoose');

var ProjectModel = mongoose.model('ProjectModel');

exports.load = function(id, cb) {
    async.waterfall([
        function(callback) {
            var options = {};
            ProjectModel.load(id, options, function(err, project) {
                if (err) {
                    callback(err);
                } else if (!project) {
                    callback(new Error('Failed to load Project ' + id));
                }
                callback(null, project);
            });
        }
    ], cb);
}

exports.listByIds = function(projectIds, cb) {
    var options = {
        criteria: {
            '_id': {
                $in: projectIds
            }
        }
    };
    ProjectModel.list(options, cb);
}