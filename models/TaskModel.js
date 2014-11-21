// models/TaskModel.js
var config = require('../config/config');
var utils = require(config.path.lib + '/utils');
var autoIncrement = require(config.path.lib + '/mongoose-auto-increment');
var mongoose = require('mongoose');
// For shortcut
var ObjectId = mongoose.Schema.ObjectId;

/**
 * Schema Tree
 */
var TaskModelSchema = new mongoose.Schema({
    creatorId: {type: ObjectId, ref: 'user'},
    projectId: {type: ObjectId, ref: 'project'},
    ref: {type: String, trim: true},
    title: {type: String, trim: true},
    priority: {type: Number, default: 0},
    category: {
        id: {type: ObjectId},
        name: {type: String, trim: true}
    },
    description: {type: String},
    media: {},
    date: {
        created: {type: Date, default: Date.now},
        updated: {type: Date, default: Date.now},
    },
    time: {
        estimation: {type: Number},
        consomation: {type: Number}
    },
    status: {type: Number, default: 1}
});

/**
 * Validations
 */
var requiredFields = [
    'creatorId',
    'projectId',
    // 'ref',
    'title',
    'description',
];
// Passing schema by ref, add required field validation
utils.addRequiredValidation(TaskModelSchema, requiredFields);

// Limitation of title length
TaskModelSchema.path('title').validate(function(title) {
    // 50 limitation
    if (typeof(title) !== 'undefined' && title.length > 50) {
        return false;
    }
    else {
        true;
    }
}, 'Invalid title - title is too long (max.50)');

TaskModelSchema.methods = {
    update: function(data, cb) {
        for (property in data) {
            this[property] = data[property];
        }
        this.date.updated = Date.now();
        this.save(cb);
    }
}

var autoIncrementSettings = {
    model: 'TaskModel',
    field: 'shortId',
    idField: 'projectId'
}
// Add field into schema
TaskModelSchema.plugin(autoIncrement.plugin, autoIncrementSettings);


/**
 * Static functions
 * Heritage basic functions
 */
TaskModelSchema.statics = utils.modelStatics;
TaskModelSchema.statics.loadByProjectId = function(projectId, options, cb) {
    var criteria = options.criteria || {};
    var projectCriteria = {
        projectId: projectId.toString()
    }
    criteria = utils.mergeObj(criteria, projectCriteria);
    var query = this.find(criteria);
    query.exec(cb);
};


/*
 * Overwrite
 */
TaskModelSchema.statics.loadByShortIdQuery = function(taskShortId, projectId, options, cb) {
    var criteria = options.criteria || {};
    var taskCriteria = {
        projectId: projectId.toString(),
        shortId: taskShortId.toString()
    }
    criteria = utils.mergeObj(criteria, taskCriteria);
    var query = this.findOne(criteria);

    return query;
}

/*
 * Overwrite
 */
TaskModelSchema.statics.loadByShortId = function(taskShortId, projectId, options, cb) {
    var query = this.loadByShortIdQuery(taskShortId, projectId, options);
    query.exec(cb);
}

/*
 * Overwrite
 */
TaskModelSchema.statics.loadJsonByShortId = function(taskShortId, projectId, options, cb) {
    var query = this.loadByShortIdQuery(taskShortId, projectId, options);
    query.lean().exec(cb);
}

/**
 * Ending part
 */
// Exports schema if needed
exports.TaskModelSchema = TaskModelSchema;
// Build in mongo
mongoose.model('TaskModel', TaskModelSchema);
exports.TaskModel = mongoose.model('TaskModel');
