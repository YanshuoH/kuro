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
var required_fields = [
    // 'user',
    // 'project',
    'title',
    'description',
];
for (var index=0; index<required_fields.length; index++) {
    TaskModelSchema.path(required_fields[index])
        .required(true, 'Field ' + required_fields[index] + ' is mandatory');
}
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


/**
 * Ending part
 */
// Exports schema if needed
exports.TaskModelSchema = TaskModelSchema;
// Build in mongo
mongoose.model('TaskModel', TaskModelSchema);
exports.TaskModel = mongoose.model('TaskModel');
