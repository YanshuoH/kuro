// passport config
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var UserModel = mongoose.model('UserModel');

module.exports = function (passport, config) {
    // serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        UserModel.findOne({ _id: id }, function (err, user) {
            done(err, user);
        });
    });

    // local-signin strategy
    passport.use('local-signin', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            process.nextTick(function() {
                var options = {};
                UserModel.findOne({ email: email }, options, function (err, user) {
                    if (err) { return done(err); }
                    if (!user) {
                        return done(null, false, {
                            status: 404,
                            message: 'Unknown user'
                        });
                    }
                    if (!user.authenticate(password)) {
                        return done(null, false, {
                            status: 403,
                            message: 'Invalid password'
                        });
                    }
                    return done(null, user, {
                        status: 200,
                        message: 'Login succeed'
                    });
                });
            });
        })
    );
}