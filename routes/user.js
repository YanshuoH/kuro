var mongoose = require('mongoose');
var passport = require('passport');
var UserModel = mongoose.model('UserModel');


exports.load = function(req, res, next, id) {
    UserModel.load(id.toString(), function(err, user) {
        if (err) {
            return next(err);
        } else if (!user) {
            return next(new Error('Failed to load User ' + id));
        }
        req.user = user;
        next();
    });
}

exports.show = function(req, res) {
    var user = req.user;
    res.json(user);
}

exports.editor = function(req, res) {
    res.send(true);
}

exports.session = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        console.log(info);
        if (err) {
            return next(err);
        }
        // Generate a JSON response reflecting authentication status
        // This is eventually overwritten by passport middleware
        // and not being used
        if (!user) {
            return res.send({ success : false, message : 'authentication failed' });
        }
        return res.send({ success : true, message : 'authentication succeeded' });
    })(req, res, next);
}