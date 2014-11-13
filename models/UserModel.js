// models/UserModel.js
var SECRET_KEY = 'KISSMYASS';

var config = require('../config/config');
var utils = require(config.path.lib + '/utils');
var autoIncrement = require(config.path.lib + '/mongoose-auto-increment');

var mongoose = require('mongoose');
var crypto = require('crypto');
// Shortcut
var ObjectId = mongoose.Schema.ObjectId;

/**
 * Schema Tree
 */
var UserModelSchema = new mongoose.Schema({
    username: {type: String, unique: true, trim: true},
    hashed_password: {type: String},
    email: {type: String, unique: true},
    projectIds: [{type: ObjectId, ref: 'project'}],
    date: {
        created: {type: Date, default: Date.now},
        updated: {type: Date, default: Date.now},
    },
    status: {type: Number, default: 1},
    isActive: {type: Number, default: 1}
});

UserModelSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function() { return this._password });

/**
 * Validations
 */
var requiredFields = [
    'username',
    'email',
    'hashed_password'
];
// Passing schema by ref, add required field validation
utils.addRequiredValidation(UserModelSchema, requiredFields);


UserModelSchema.methods = {
    encryptPassword: function(password) {
        return crypto.createHmac('sha1', new Buffer(SECRET_KEY, 'utf-8'))
            .update(password)
            .digest('hex');
    },
    makeSalt: function() {
        return SECRET_KEY;
        // return Math.round((new Date().valueOf() * Math.random())) + '';
    },
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    }
}

var customStatics = {
}

UserModelSchema.statics = utils.mergeObj(utils.modelStatics, customStatics);


var autoIncrementSettings = {
    model: 'UserModel',
    field: 'shortId'
}
// Add field into schema
UserModelSchema.plugin(autoIncrement.plugin, autoIncrementSettings);


/**
 * Ending part
 */
// Exports schema if needed
exports.UserModelSchema = UserModelSchema;
// Build in mongo
mongoose.model('UserModel', UserModelSchema);
exports.UserModel = mongoose.model('UserModel');
