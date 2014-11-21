var config = require('../config/config');
var utils = require(config.path.lib + '/utils');
var UserRepository = require(config.path.repository + '/user');
var TaskRepository = require(config.path.repository + '/task');

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

exports.loadByShortId = function(projectShortId, cb) {
    async.waterfall([
        function(callback) {
            var options = {};
            ProjectModel.loadByShortId(projectShortId, options, function(err, project) {
                if (err) {
                    callback(err);
                } else if (!project) {
                   callback(new Error('Failed to load Project by shortId ' + projectShortId));
                } else {
                    callback(null, project);
                }
            });
        }
    ], cb);
}

exports.fetch = function(project, fetchOptions, cb) {
    var fetchOptions = fetchOptions || [];

    var init = function(callback) {
        callback(null, project.toObject());
    };

    var fetchUser = function(project, callback) {
        UserRepository.listByIds(project.userIds, function(err, users) {
            if (err) {
                callback(err);
            } else {
                project.users = users;
                callback(null, project);
            }
        });
    };

    var fetchTask = function(project, callback) {
        TaskRepository.jsonListByProjectFetch(project._id, function(err, tasks) {
            if (err) {
                callback(err);
            } else {
                project.tasks = tasks;
                callback(null, project);
            }
        });
    }

    // generate query series
    var functions = [init];
    if (fetchOptions.length > 0) {
        if (utils.inArray('fetchUser', fetchOptions)) {
            functions.push(fetchUser);
        }

        if (utils.inArray('fetchTask', fetchOptions)) {
            functions.push(fetchTask);
        }
    }

    async.waterfall(functions, cb);
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

/*
 * Maybe this part shall called entity/manager
 */
exports.save = function(project, callback) {
    project.date.updated = Date.now();
    project.save(callback);
}

exports.create = function(req, callback) {
    var userId = req.user._id;
    var personal = {
        creatorId: userId,
        adminIds: [userId],
        userIds: [userId]
    };

    var data = utils.mergeObj(req.body, personal);
    var project = new ProjectModel(data);

    async.waterfall([
        function(projectCallback) {
            exports.save(project, function(err) {
                if (err) {
                    projectCallback(err);
                } else {
                    projectCallback(null, project);
                }
            });
        },
        function(project, userCallback) {
            UserRepository.addProjectToUser(project._id, req.user, function(err) {
                if (err) {
                    userCallback(err);
                } else {
                    userCallback(null, project);
                }
            });
        }
    ], callback);
}

exports.update = function(req, callback) {
    var project = req.project;
    var formData = req.body;
    async.waterfall([
        function(projectCallback) {
            project.update(formData, function(err) {
                if (err) {
                    projectCallback(err);
                } else {
                    projectCallback(null, project);
                }
            });
        }
    ], callback)
}

exports.createDefaultProject = function(user, callback) {
    var data = {
        creatorId: user._id,
        adminIds: [user._id],
        userIds: [user._id],
        ref: 'REF',
        title: 'My Project',
        description: 'My first project'
    }
    var project = new ProjectModel(data);
    async.waterfall([
        function(saveCallback) {
            exports.save(project, function(err) {
                if (err) {
                    saveCallback(err);
                } else {
                    saveCallback(null, project, user);
                }
            });
        },
        function(project, user, userCallback) {
            UserRepository.addProjectToUser(project._id, user, function(err) {
                if (err) {
                    userCallback(err);
                } else {
                    userCallback(null, project, user);
                }
            });
        }
    ], callback);
}