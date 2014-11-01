var async = require('async');

var mongoose = require('mongoose');
var UserModel = mongoose.model('UserModel');

exports.load = function(userId, cb) {
    async.waterfall([
        function(callback) {
            var options = {};
            UserModel.load(userId, options, function(err, user) {
                if (err) {
                    callback(err);
                } else if (!user) {
                    callback(new Error('Failed to load User ' + userId));
                }
                callback(null, user);
            });
        }
    ], cb);
}