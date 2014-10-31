var mongoose = require('mongoose');
var passport = require('passport');
var UserModel = mongoose.model('UserModel');

/*
 * @param userId
 *
 * When :userId detected in url, load and fetch user in req
 */
exports.load = function(req, res, next, id) {
    var options = {};
    UserModel.load(id.toString(), options, function(err, user) {
        if (err) {
            return next(err);
        } else if (!user) {
            return next(new Error('Failed to load User ' + id));
        }
        req.user = user;
        next();
    });
}

/*
 * @path('/api/user/:userId') || @path('/api/user/info')
 *
 * Return JSON user
 */
exports.show = function(req, res) {
    // TODO: do not return credential data
    if (typeof(req.user) !== 'undefined') {
        var user = req.user;
        res.json(user);
    } else {
        res.send(false);
    }

}

/*
 * @path('/api/user/edit')
 *
 */
exports.editor = function(req, res) {
    res.send(true);
}

/*
 * @path('/api/user/signin')
 *
 * Create user session
 * Return String|Object login info
 */
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


/*
 * @path('/api/user/signout')
 *
 * Destroy user session
 */
exports.signout = function(req, res) {
    // req.session.destroy();
    req.session = null;
    // req.session.save();
    req.logout();
    res.send(true);
}
