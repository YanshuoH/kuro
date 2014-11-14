var config = require('../config/config');

var async = require('async');

var ProjectRepository = require(config.path.repository + '/project');

var mongoose = require('mongoose');
var UserModel = mongoose.model('UserModel');

exports.load = function(userId, cb) {
    async.waterfall([
        function(callback) {
            var options = {};
            UserModel.load(userId, options, function(err, user) {
                if (err) {
                    callback(err);
                } else if (!user) {
                    callback(new Error('Failed to load User ' + userId));
                }
                callback(null, user);
            });
        }
    ], cb);
}

/*
 * Maybe this part shall called entity/manager
 */
exports.save = function(user, callback) {
    user.date.updated = Date.now();
    user.save(callback);
}

// create user, then create default project
// callback returns (err, user, project)
exports.create = function(formData, callback) {
    async.waterfall([
        function(userCallback) {
            var user = new UserModel(formData);
            exports.save(user, function(err) {
                if (err) {
                    userCallback(err);
                } else {
                    userCallback(null, user);
                }
            })
        },
        function(user, projectCallback) {
            ProjectRepository.createDefaultProject(user, function(err, project, user) {
                if (err) {
                    projectCallback(err);
                } else {
                    projectCallback(null, user, project);
                }
            });
        }
    ], callback);
}


// ObjectId @project
// UserModel @user
exports.addProjectToUser = function(projectId, user, callback) {
    user.projectIds.push(projectId);
    console.log(user);
    user.save(callback);
}