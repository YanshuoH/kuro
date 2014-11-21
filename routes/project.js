var async = require('async');

var config = require('../config/config');
var utils = require(config.path.lib + '/utils');
var ProjectRepository = require(config.path.repository + '/project');

var mongoose = require('mongoose');
var ProjectModel = mongoose.model('ProjectModel');

/*
 * @param projectShortId
 *
 * When :projectShortId detected in url, load and fetch project in req
 */
exports.loadByShortId = function(req, res, next, id) {
    ProjectRepository.loadByShortId(id, function(err, project) {
        if (err) {
            return next(err);
        }
        req.project = project;
        next();
    });
}

/*
 * @path('/api/project/:projectShortId')
 *
 * Return JSON project with tasks and users affected
 */
exports.show = function(req, res) {
    var fetchOptions = ['fetchUser', 'fetchTask'];
    var project = req.project;
    ProjectRepository.fetch(project, fetchOptions, function(err, project) {
        if (err) {
            res.send(err);
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
            console.log(err);
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
// TODO: migrate to repository
exports.create = function(req, res) {
    ProjectRepository.create(req, function(err, project) {
        if (err) {
            res.send(err);
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
            res.send(err);
        } else {
            res.json(project);
        }
    });
}