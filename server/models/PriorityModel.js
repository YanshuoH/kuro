// models/PriorityModel.js
var config = require('../config/config');
var utils = require(config.path.lib + '/utils');

var mongoose = require('mongoose');
// For shortcut
var ObjectId = mongoose.Schema.ObjectId;

/**
 * Schema Tree
 */
var PriorityModelSchema = new mongoose.Schema({
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
utils.addRequiredValidation(PriorityModelSchema, requiredFields);

// Limitation of title length
PriorityModelSchema.path('code').validate(function(title) {
    // 50 limitation
    if (typeof(title) !== 'undefined' && title.length > 5) {
        return false;
    }
    else {
        true;
    }
}, 'Invalid priority code - code is too long (max.4)');

// Limitation of Ref length
PriorityModelSchema.path('label').validate(function(ref) {
    // 50 limitation
    if (typeof(ref) !== 'undefined' && ref.length > 21) {
        return false;
    }
    else {
        true;
    }
}, 'Invalid priority label - label is too long (max.20)');

/**
 * Static functions
 * Heritage basic functions
 */
PriorityModelSchema.statics = utils.modelStatics;

PriorityModelSchema.methods = {
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
exports.PriorityModelSchema = PriorityModelSchema;
// Build in mongo
mongoose.model('PriorityModel', PriorityModelSchema);
exports.PriorityModel = mongoose.model('PriorityModel');