var async = require('async');

var config = require('../config/config');
var utils = require(config.path.lib + '/utils');
var errorHandler = require(config.path.lib + '/errorHandler');

var TaskRepository = require(config.path.repository + '/task');
var ProjectRepository = require(config.path.repository + '/project');
var UserRepository = require(config.path.repository + '/user');
var PriorityRepository = require(config.path.repository + '/priority');

var mongoose = require('mongoose');
var ProjectModel = mongoose.model('ProjectModel');

/*
 * @param projectShortId
 *
 * When :projectShortId detected in url, load and fetch project in req
 */
exports.loadByShortId = function(req, res, next, id) {
    if (!req.isAuthenticated()) {
        return errorHandler.handle(res, {
            status: 401,
            message: 'Please login with your account'
        });
    }
    ProjectRepository.loadByShortId(id, function(err, project) {
        if (err) {
            return errorHandler.handle(res, err);
        }
        req.project = project;
        next();
    });
}

/*
 * @path('/api/project/:projectShortId')
 *
 * Return JSON project with optional fields affected
 */
exports.show = function(req, res) {
    var fetchOptions = [];
    if (req.query.hasOwnProperty('fetchStatus') && req.query.fetchStatus === '1') {
        fetchOptions.push('fetchStatus');
    }

    if (req.query.hasOwnProperty('fetchPriority') && req.query.fetchPriority === '1') {
        fetchOptions.push('fetchPriority');
    }

    if (req.query.hasOwnProperty('fetchUser') && req.query.fetchUser === '1') {
        fetchOptions.push('fetchUser');
    }

    var project = req.project;
    ProjectRepository.fetch(project, fetchOptions, function(err, project) {
        if (err) {
            return errorHandler.handle(res, err);
        } else {
            res.json(project);
        }
    });
}

/*
 * @path(/api/project)
 *
 * Return an array of projects by userId
 */
exports.listByIds = function(req, res) {
    var options = {
        criteria: {
            '_id': {
                $in: req.user.projectIds
            }
        }
    };
    ProjectRepository.listByIds(req.user.projectIds, function(err, list) {
        if (err) {
            res.send(err);
        } else {
            res.json(list);
        }
    });
}


/*
 * @path(/api/project/create)
 *
 * POST
 */
exports.create = function(req, res) {
    ProjectRepository.create(req, function(err, project) {
        if (err) {
            return errorHandler.handle(res, err);
        } else {
            res.json(project);
        }
    });
}

/*
 * @path(/api/project/:projectShortId/edit)
 *
 * PUT
 */
exports.update = function(req, res) {
    async.waterfall([
        // Validations
        function(callback) {
            // All precautions whom's not async
            if (typeof(req.body['adminIds']) !== 'undefined') {
                var diff = utils.arrayDiff(req.project.adminIds, req.body.adminIds);
                if (diff.length === 1) {
                    if (diff[0].toString() === req.user._id.toString()) {
                        callback({
                            status: 422,
                            message: 'You cannot remove yourself'
                        });
                    } else {
                        callback(null);
                    }
                } else {
                    callback({
                        status: 422,
                        message: 'One admin per time'
                    });
                }
            } else {
                callback(null);
            }
        },
        function(callback) {
            // For priority
            if (typeof(req.body['priorityData']) !== 'undefined') {
                var diff = utils.arrayDiff(req.project.priorityData, req.body.priorityData);
                if (diff.length === 1) {
                    TaskRepository.loadByProjectAndAlias(req.project._id, 'priority', diff[0].toString(), function(err, tasks) {
                        if (tasks.length > 0) {
                            callback({
                                status: 422,
                                message: 'You have task(s) attached to this priority'
                            });
                        } else {
                            callback(null);
                        }
                    })
                } else {
                    callback({
                        status: 422,
                        message: 'One priority per time'
                    });
                }
            } else {
                callback(null);
            }
        },
        function(callback) {
            // For status
            if (typeof(req.body['statusData']) !== 'undefined') {
                var diff = utils.arrayDiff(req.project.statusData, req.body.statusData);
                if (diff.length === 1) {
                    TaskRepository.loadByProjectAndAlias(req.project._id, 'status', diff[0].toString(), function(err, tasks) {
                        if (tasks.length > 0) {
                            callback({
                                status: 422,
                                message: 'You have task(s) attached to this status'
                            });
                        } else {
                            callback(null);
                        }
                    });
                } else {
                    callback({
                        status: 422,
                        message: 'One status per time'
                    });
                }
            } else {
                callback(null);
            }
        }
    ], function(err, result) {
        if (err) {
            errorHandler.handle(res, err);
        } else {
            ProjectRepository.update(req.project, req.body, function(err, project) {
                if (err) {
                    errorHandler.handle(res, err);
                } else {
                    res.json(project);
                }
            });
        }

    });
}

/*
 * @path(/api/project/:projectShortId/user/add)
 *
 * POST
 */
exports.addUser = function(req, res) {
    ProjectRepository.addUser(req, function(err, user) {
        if (err) {
            return errorHandler.handle(res, err);
        } else {
            res.json(user);
        }
    })
};

/**
 * @path(/api/project/:projectShortId/priority/create) POST
 * 
 * return priority
 * 
 */
exports.createAndAddPriority = function(req, res) {
    async.waterfall([
        function(callback) {
            PriorityRepository.create(req.body, req.user, function(err, priority) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, priority);
                }
            });
        },
        function(priority, callback) {
            var project = req.project;
            project.priorityData.push(priority._id);
            ProjectRepository.save(project, function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, priority)
                }
            });
        }
    ], function(err, priority) {
        if (err) {
            return errorHandler.handle(res, err);
        } else {
            res.json(priority);
        }
    });
}