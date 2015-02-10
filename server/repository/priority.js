var config = require('../config/config');
var utils = require(config.path.lib + '/utils');
var async = require('async');

var ProjectRepository = require(config.path.repository + '/project');

var mongoose = require('mongoose');
var PriorityModel = mongoose.model('PriorityModel');

/*
 * @param ObjectId id priorityId
 * @param Object options
 *
 * Callback (err, priority)
 */
exports.loadById = function(priorityId, options, cb) {
    var defaultOptions = {};
    PriorityModel.load(priorityId, utils.mergeObj(defaultOptions, options), cb);
};


/*
 * @param Object options
 *
 * Callback (err, array)
 */
exports.loadDefaultlist = function(options, cb) {
    var defaultOptions = {
        criteria: {
            type: 'default'
        }
    };
    PriorityModel.list(utils.mergeObj(defaultOptions, options), cb);
};


/*
 * @param Array priorityIdList
 * @param Object options
 *
 * Callback (err, array)
 */
exports.loadByIds = function(priorityIdList, options, cb) {
    var defaultOptions = {
        criteria: {
            _id: { $in: priorityIdList }
        }
    };
    PriorityModel.list(utils.mergeObj(defaultOptions, options), cb);
};

/*
 * @param ObjectId projectId
 * @param Object options
 *
 * Callback (err, array), array of PriorityModel
 */
exports.loadListByProject = function(projectId, options, cb) {
    var defaultOptions = {};
    async.waterfall([
        function(callback) {
            ProjectRepository.load(projectId, function(err, project) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, project);
                }
            });
        }, function(project, callback) {
            exports.loadByIds(project.priorityData, utils.mergeObj(defaultOptions, options), function(err, priorityList) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, priorityList);
                }
            });
        }
    ], cb);
};
