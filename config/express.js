var path = require('path');
var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var serveStatic = require('serve-static')
var favicon = require('serve-favicon');


module.exports = function(app, config) {
    app.set('views', path.join(config.root + '/views'));
    app.set('view engine', 'jade');

    app.use(cookieParser());

    // app.use(session({secret: 'keyboard cat'}));
    app.use(favicon(path.join(config.root, 'public/favicon.ico')));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use(morgan('dev'));

    app.use(serveStatic(path.join(config.root, 'public')));
}