var async = require('async');

var config = require('../config/config');
var projectRepository = require(config.path.repository + '/project');
var utils = require(config.path.lib + '/utils');

var mongoose = require('mongoose');

var ProjectModel = mongoose.model('ProjectModel');

/*
 * @param projectId
 *
 * When :projectId detected in url, load and fetch project in req
 */
exports.load = function(req, res, next, id) {
    var options = {};
    ProjectModel.load(id.toString(), options, function(err, project) {
        if (err) {
            return next(err);
        }
        req.project = project;
        next();
    });
}

/*
 * @path('/api/project/:projectId')
 *
 * Return JSON project
 */
exports.show = function(req, res) {
    var project = req.project;
    res.json(project);
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
    projectRepository.listByIds(req.user.projectIds, function(err, list) {
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
    var userId = req.user._id;
    // initialize project user data
    // TODO: fetch more users by frontend dropdown
    var personal = {
        creatorId: userId,
        adminIds: [userId],
        userIds: [userId]
    }
    var data = utils.mergeObj(req.body, personal);
    var project = new ProjectModel(data);

    async.waterfall([
        function(callback) {
            project.save(function(err) {
                if (err) {
                    callback(null, err);
                } else {
                    callback(null, false);
                }
            });
        },
        function(err, callback) {
            if (err) {
                callback(null, err);
            } else {
                var user = req.user;
                user.projectIds.push(project._id.toString());
                user.save(function(err) {
                    if (err) {
                        callback(null, err);
                    } else {
                        callback(null, null);
                    }
                });
            }
        }
    ], function(err, msg) {
        if (err) {
            console.log(msg);
        }
        if (msg) {
            res.json({
                status: 500,
                message: msg
            });
        } else {
            res.json({
                status: 200,
                project: {
                    _id: project._id
                }
            });
        }
    });

}

/*
 * @path(/api/project/:projectId/edit)
 *
 * PUT
 */
exports.update = function(req, res) {

}