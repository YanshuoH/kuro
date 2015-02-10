var config = require('../config/config');
var async = require('async');

var errorHandler = require(config.path.lib + '/errorHandler');
var successHandler = require(config.path.lib + '/successHandler');

var PriorityRepository = require(config.path.repository + '/priority');

/*
 * @param ObjectId id
 *
 * When :priorityId detected in url, load priority model
 */
exports.loadById = function(req, res, next, id) {
    var options = {};
    PriorityRepository.loadById(id, options, function(err, priority) {
        if (err) {
            return errorHandler.handle(res, err);
        }
        req.priority = priority;
        next();
    });
};

/*
 * @path('/api/priority/:priorityId')
 *
 * Return JSON priority
 */
exports.show = function(req, res) {
    res.json(req.priority);
};



/*
 * @path('/api/priority/default')
 *
 * Return JSON priorityList by default
 */
exports.loadDefaultList = function(req, res) {
    var options = {};
    PriorityRepository.loadDefaultlist(options, function(err, priorityList) {
        if (err) {
            return errorHandler.handle(res, err);
        }
        res.json(priorityList);
    });
};

/*
 * @path('/api/project/:projectShortId/priority')
 *
 * Return JSON priority list by projectId
 */
exports.loadPriorityByProject = function(req, res) {
    var options = {};
    PriorityRepository.loadListByProject(req.project._id, options, function(err, priorityList) {
        if (err) {
            return errorHandler.handle(res, err);
        }
        res.json(priorityList);
    });
};