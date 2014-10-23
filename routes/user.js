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

exports.signin = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return res.send(err);
        }
        // Generate a JSON response reflecting authentication status
        if (!user) {
            return res.send(info);
        }
        // When using custom middleware to handle the callback msg,
        // It become the application's responsibility to call req.login
        req.login(user, function(err) {
            if (err) {
                console.log(err);
            }
            return res.send(info);
        });
    })(req, res, next);
}

exports.session = function(req, res) {

}


exports.signout = function(req, res) {
    req.session.destroy();
    // req.session.save();
    req.logout();
    res.send(true);
}
