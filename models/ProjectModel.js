// models/ProjecdtModel.js
var utils = require('../lib/utils');
var mongoose = require('mongoose');
// For shortcut
var ObjectId = mongoose.Schema.ObjectId;

/**
 * Schema Tree
 */
var ProjectModelSchema = new mongoose.Schema({
    creator: {type: ObjectId, ref: 'user'},
    admin: [{
        type: ObjectId, ref: 'user'
    }],
    users: [{
        type: ObjectId, ref: 'user'
    }],
    title: {type: String, trim: true},
    description: {type: String},
    ref: {type: String, trim: true},
    date: {
        created: {type: Date, default: Date.now},
        updated: {type: Date, default: Date.now}
    },
    status: {type: Number, default: 1}
});


/**
 * Validations
 */
var requiredFields = [
    // 'creator'
    // 'admin'
    // 'users',
    // 'project',
    'ref',
    'title',
    'description',
];
// Passing schema by ref, add required field validation
utils.addRequiredValidation(ProjectModelSchema, requiredFields);

// Limitation of title length
ProjectModelSchema.path('title').validate(function(title) {
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
ProjectModelSchema.pre('save', function(next) {
    // update updated date
    this.date.updated = Date.now();
    next();
});

/**
 * Static functions
 * Heritage basic functions
 */
ProjectModelSchema.statics = utils.modelStatics;


/**
 * Ending part
 */
// Exports schema if needed
exports.ProjectModelSchema = ProjectModelSchema;
// Build in mongo
mongoose.model('ProjectModel', ProjectModelSchema);
exports.ProjectModel = mongoose.model('ProjectModel');
