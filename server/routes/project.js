var async = require('async');

var config = require('../config/config');
var utils = require(config.path.lib + '/utils');
var errorHandler = require(config.path.lib + '/errorHandler');

var ProjectRepository = require(config.path.repository + '/project');

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
    var fetchOptions = ['fetchStatus', 'fetchPriority'];
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
 * @path(/api/project/:projectId/edit)
 *
 * PUT
 */
exports.update = function(req, res) {
    ProjectRepository.update(req, function(err, project) {
        if (err) {
            return errorHandler.handle(res, err);
        } else {
            res.json(project);
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