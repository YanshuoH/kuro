var config = require('../config/config');
var utils = require(config.path.lib + '/utils');
var UserRepository = require(config.path.repository + '/user');
var TaskRepository = require(config.path.repository + '/task');
var StatusRepository = require(config.path.repository + '/status');
var PriorityRepository = require(config.path.repository + '/priority');
var async = require('async');

var mongoose = require('mongoose');
var ProjectModel = mongoose.model('ProjectModel');
var PriorityModel = mongoose.model('PriorityModel');


exports.load = function(id, cb) {
    async.waterfall([
        function(callback) {
            var options = {};
            ProjectModel.load(id, options, function(err, project) {
                if (err) {
                    callback(err);
                } else if (!project) {
                    callback({
                        status: 204,
                        message: 'Failed to load project by id ' + id
                   });
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
                   callback({
                        status: 204,
                        message: 'Failed to load project by shortId ' + projectShortId
                   });
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
    };

    var fetchStatus = function(project, callback) {
        var options = {
            criteria: {
                _id: { $in: project.statusData }
            }
        };
        StatusRepository.loadListByProject(project._id, {}, function(err, statusList) {
            if (err) {
                callback(err);
            } else {
                project.statusData = statusList;
                callback(null , project);
            }
        });
    };

    var fetchPriority = function(project, callback) {
        var options = {
            criteria: {
                _id: { $in: project.priorityData }
            }
        };
        PriorityRepository.loadListByProject(project._id, {}, function(err, priorityList) {
            if (err) {
                callback(err);
            } else {
                project.priorityData = priorityList;
                callback(null , project);
            }
        });
    };

    // generate query series
    var functions = [init];
    if (fetchOptions.length > 0) {
        if (utils.inArray('fetchUser', fetchOptions)) {
            functions.push(fetchUser);
        }

        if (utils.inArray('fetchTask', fetchOptions)) {
            functions.push(fetchTask);
        }

        if (utils.inArray('fetchStatus', fetchOptions)) {
            functions.push(fetchStatus);
        }

        if (utils.inArray('fetchPriority', fetchOptions)) {
            functions.push(fetchPriority);
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
exports.save = function(project, cb) {
    project.date.updated = Date.now();
    project.save(cb);
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
            exports.createLinkProjectUser(project, user, function(err, results) {
                if (err) {
                    userCallback(err);
                } else {
                    userCallback(null, results.project, results.user);
                }
            });
        }
    ], callback);
}

/*
 * @param project ProjectModel
 * @param user UserModel
 *
 * Callback: (err, results) - results { user: user, project: project }
 */
exports.createLinkProjectUser = function(project, user, cb) {
    async.parallel({
        user: function(callback) {
            UserRepository.addProjectToUser(project._id, user, function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, user);
                }
            });
        },
        project: function(callback) {
            project.userIds.push(user._id);
            exports.save(project, function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, project);
                }
            })
        }
    }, cb);
}

exports.addUser = function(req, cb) {
    var project = req.project;
    var username = req.body.username;
    async.waterfall([
        // load user by username
        function(callback) {
            UserRepository.loadByUsername(username, function(err, user) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, user);
                }
            });
        },
        // add user to project
        function(user, callback) {
            exports.createLinkProjectUser(project, user, function(err, results) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, results.user);
                }
            });
        }
    ], cb);
}