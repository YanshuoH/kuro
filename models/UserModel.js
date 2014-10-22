// models/UserModel.js
var SECRET_KEY = 'KISSMYASS';
var utils = require('../lib/utils');
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
    project: [{type: ObjectId, ref: 'project'}],
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
    'password'
];
// Passing schema by ref, add required field validation
// utils.addRequiredValidation(UserModelSchema, requiredFields);


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

/**
 * Pre save
 */
UserModelSchema.pre('save', function(next) {
    // update updated date
    this.date.updated = Date.now();
    next();
});

/**
 * Ending part
 */
// Exports schema if needed
exports.UserModelSchema = UserModelSchema;
// Build in mongo
mongoose.model('UserModel', UserModelSchema);
exports.UserModel = mongoose.model('UserModel');
