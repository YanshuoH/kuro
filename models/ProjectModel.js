// models/ProjecdtModel.js
var config = require('../config/config');
var utils = require(config.path.lib + '/utils');
var autoIncrement = require(config.path.lib + '/mongoose-auto-increment');

var mongoose = require('mongoose');
// For shortcut
var ObjectId = mongoose.Schema.ObjectId;

/**
 * Schema Tree
 */
var ProjectModelSchema = new mongoose.Schema({
    creatorId: {type: ObjectId, ref: 'user'},
    adminIds: [{
        type: ObjectId, ref: 'user'
    }],
    userIds: [{
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
    'creatorId',
    'adminIds',
    'userIds',
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

// Limitation of Ref length
ProjectModelSchema.path('ref').validate(function(ref) {
    // 50 limitation
    if (typeof(ref) !== 'undefined' && ref.length > 4) {
        return false;
    }
    else {
        true;
    }
}, 'Invalid ref - ref is too long (max.4)');

/**
 * Static functions
 * Heritage basic functions
 */
ProjectModelSchema.statics = utils.modelStatics;

ProjectModelSchema.methods = {
    update: function(data, cb) {
        for (property in data) {
            this[property] = data[property];
        }
        this.date.updated = Date.now();
        this.save(cb);
    }
}

var autoIncrementSettings = {
    model: 'ProjectModel',
    field: 'shortId',
    idField: '_id'
}
// Add field into schema
ProjectModelSchema.plugin(autoIncrement.plugin, autoIncrementSettings);


/**
 * Ending part
 */
// Exports schema if needed
exports.ProjectModelSchema = ProjectModelSchema;
// Build in mongo
mongoose.model('ProjectModel', ProjectModelSchema);
exports.ProjectModel = mongoose.model('ProjectModel');
