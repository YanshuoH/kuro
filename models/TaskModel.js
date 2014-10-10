// models/TaskModel.js
var utils = require('../lib/utils');
var mongoose = require('mongoose');
// For shortcut
var ObjectId = mongoose.Schema.ObjectId;

/**
 * Schema Tree
 */
var TaskModelSchema = new mongoose.Schema({
    user: {type: ObjectId, ref: 'user'},
    project: {type: ObjectId, ref: 'project'},
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
    // 'user',
    // 'project',
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

/**
 * Pre save
 */
TaskModelSchema.pre('save', function(next) {
    // update updated date
    this.date.updated = Date.now();
    next();
});

/**
 * Static functions
 * Heritage basic functions
 */
TaskModelSchema.statics = utils.modelStatics;
TaskModelSchema.statics.loadByProjectId = function(projectId, cb) {
    var criteria = {
        project: projectId.toString()
    }
    var query = this.find(criteria);
    query.exec(cb);
}

/**
 * Ending part
 */
// Exports schema if needed
exports.TaskModelSchema = TaskModelSchema;
// Build in mongo
mongoose.model('TaskModel', TaskModelSchema);
exports.TaskModel = mongoose.model('TaskModel');
