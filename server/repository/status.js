var config = require('../config/config');
var utils = require(config.path.lib + '/utils');
var async = require('async');

var ProjectRepository = require(config.path.repository + '/project');

var mongoose = require('mongoose');
var StatusModel = mongoose.model('StatusModel');

/*
 * @param ObjectId id statusId
 * @param Object options
 *
 * Callback (err, status)
 */
exports.loadById = function(statusId, options, cb) {
    var defaultOptions = {};
    StatusModel.load(statusId, utils.mergeObj(defaultOptions, options), cb);
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
    StatusModel.list(utils.mergeObj(defaultOptions, options), cb);
};


/*
 * @param Array statusIdList
 * @param Object options
 *
 * Callback (err, array)
 */
exports.loadByIds = function(statusIdList, options, cb) {
    var defaultOptions = {
        criteria: {
            _id: { $in: statusIdList }
        }
    };
    StatusModel.list(utils.mergeObj(defaultOptions, options), cb);
};

/*
 * @param ObjectId projectId
 * @param Object options
 *
 * Callback (err, array), array of StatusModel
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
            exports.loadByIds(project.statusData, utils.mergeObj(defaultOptions, options), function(err, statusList) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, statusList);
                }
            });
        }
    ], cb);
};
