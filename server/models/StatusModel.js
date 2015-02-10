// models/StatusModel.js
var config = require('../config/config');
var utils = require(config.path.lib + '/utils');

var mongoose = require('mongoose');
// For shortcut
var ObjectId = mongoose.Schema.ObjectId;

/**
 * Schema Tree
 */
var StatusModelSchema = new mongoose.Schema({
    creatorId: {type: ObjectId, ref: 'user'},
    code: {type: String, trim: true},
    label: {type: String, trim: true},
    type: {type: String, trim: true},
    date: {
        created: {type: Date, default: Date.now},
        updated: {type: Date, default: Date.now}
    },
    weight: {type: Number, default: 0}
});

/**
 * Validations
 */
var requiredFields = [
    'creatorId',
    'code',
    'label',
    'weight'
];
// Passing schema by ref, add required field validation
utils.addRequiredValidation(StatusModelSchema, requiredFields);

// Limitation of title length
StatusModelSchema.path('code').validate(function(title) {
    // 50 limitation
    if (typeof(title) !== 'undefined' && title.length > 5) {
        return false;
    }
    else {
        true;
    }
}, 'Invalid status code - code is too long (max.4)');

// Limitation of Ref length
StatusModelSchema.path('label').validate(function(ref) {
    // 50 limitation
    if (typeof(ref) !== 'undefined' && ref.length > 21) {
        return false;
    }
    else {
        true;
    }
}, 'Invalid status label - label is too long (max.20)');

/**
 * Static functions
 * Heritage basic functions
 */
StatusModelSchema.statics = utils.modelStatics;

StatusModelSchema.methods = {
    update: function(data, cb) {
        for (property in data) {
            this[property] = data[property];
        }
        this.date.updated = Date.now();
        this.save(cb);
    }
}

/**
 * Ending part
 */
// Exports schema if needed
exports.StatusModelSchema = StatusModelSchema;
// Build in mongo
mongoose.model('StatusModel', StatusModelSchema);
exports.StatusModel = mongoose.model('StatusModel');