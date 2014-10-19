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

    // use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            UserModel.findOne({ email: email }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Unknown user' });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, { message: 'Invalid password' });
                }
                return done(null, true, { message: 'Login succeed'});
            });
        }
    ));
}