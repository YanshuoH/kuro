var path = require('path');
var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');

// One option for session
// var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);
// Another option with cookieSession
var session = require('cookie-session');

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var serveStatic = require('serve-static')
var favicon = require('serve-favicon');

module.exports = function(app, config, passport) {
    app.set('views', path.join(config.root + '/views'));
    app.set('view engine', 'jade');
    // cookie must before session
    app.use(cookieParser());

    // session must before passport
    /*
     * MongoStore session version
        var sessionOptions = config.session.sessionOptions;
        sessionOptions.store = new MongoStore({
            db: config.db.name
        });
        app.use(session(config.session.sessionOptions));
    */

    /*
     * cookieSession version
     */
     app.use(session({
        keys: config.session.sessionOptions.keys,
        secret: config.session.sessionOptions.secret,
        cookie: config.session.sessionOptions.cookie
     }))

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(favicon(path.join(config.root, 'public/favicon.ico')));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use(morgan('dev'));

    app.use(serveStatic(path.join(config.root, 'public')));
}