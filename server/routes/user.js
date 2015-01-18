var config = require('../config/config');
var utils = require(config.path.lib + '/utils');
var passport = require('passport');

var UserRepository = require(config.path.repository + '/user')

/*
 * @param userId
 *
 * When :userId detected in url, load and fetch user in req
 */
exports.load = function(req, res, next, id) {
    UserRepository.load(id, function(err, user) {
        if (err) {
            return next(err);
        }
        req.user = user;
        next();
    });
}

/*
 * @path('/api/user/login_check')
 * Only with login status can trigger this fonction
 */
exports.loginCheck = function(req, res) {
    if (req.isAuthenticated()) {
        return res.json({
            status: 200,
            message: 'User is logged in',
            user: utils.eraseCredentialFields(req.user)
        })
    }

    return res.json({
        status: 401,
        message: 'Please login with your account'
    });

}

/*
 * @path('/api/user/:userId') || @path('/api/user/info')
 *
 * Return JSON user
 */
exports.show = function(req, res) {
    var user = req.user;
    res.json(user);
}

/*
 * @path('/api/user/edit')
 *
 */
exports.editor = function(req, res, next) {
    if (req.method === 'POST') {
        var formData = req.body;
        UserRepository.create(formData, function(err, user, project) {
            if (err) {
                res.send(err);
            } else {
                exports.signin(req, res, next);
            }
        });
    } else if (req.method === 'PUT') {

    }
}

/*
 * @path('/api/user/signin')
 *
 * Create user session
 * Return String|Object login info
 */
exports.signin = function(req, res, next) {
    passport.authenticate('local-signin', function(err, user, info) {
        if (err) {
            return res.json(err);
        }
        // Generate a JSON response reflecting authentication status
        if (!user) {
            return res.json(info);
        }
        // When using custom middleware to handle the callback msg,
        // It become the application's responsibility to call req.login
        req.login(user, function(err) {
            if (err) {
                console.log(err);
            }
            return res.json(info);
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
