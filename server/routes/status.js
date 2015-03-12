var config = require('../config/config');
var async = require('async');

var errorHandler = require(config.path.lib + '/errorHandler');
var successHandler = require(config.path.lib + '/successHandler');

var StatusRepository = require(config.path.repository + '/status');

/*
 * @param ObjectId id
 *
 * When :statusId detected in url, load status model
 */
exports.loadById = function(req, res, next, id) {
    var options = {};
    StatusRepository.loadById(id, options, function(err, status) {
        if (err) {
            return errorHandler.handle(res, err);
        }
        req.status = status;
        next();
    });
};

/*
 * @path('/api/status/:statusId')
 *
 * Return JSON status
 */
exports.show = function(req, res) {
    res.json(req.status);
};



/*
 * @path('/api/status/default')
 *
 * Return JSON statusList by default
 */
exports.loadDefaultList = function(req, res) {
    var options = {};
    StatusRepository.loadDefaultlist(options, function(err, statusList) {
        if (err) {
            return errorHandler.handle(res, err);
        }
        res.json(statusList);
    });
};

/*
 * @path('/api/project/:projectShortId/status')
 *
 * Return JSON status list by projectId
 */
exports.loadStatusByProject = function(req, res) {
    var options = {};
    StatusRepository.loadListByProject(req.project._id, options, function(err, statusList) {
        if (err) {
            return errorHandler.handle(res, err);
        }
        res.json(statusList);
    });
};


/**
 * @path('/api/status/create') POST
 * 
 * Return JSON status data
 */
exports.create = function(req, res) {
    var options = {};
    StatusRepository.create(req.body, req.user, function(err, status) {
        if (err) {
            return errorHandler.handle(res, err);
        }
        res.json(status);
    });
}