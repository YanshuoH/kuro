
/**
 * Module dependencies
 */

var path = require('path');
var http = require('http');
var async = require('async');
var express = require('express');
var passport = require('passport');
var errorHandler = require('errorhandler');
var config = require(__dirname + '/config/config');
var MongoConfig = require(config.db.config);


/**
 * Connection to mongodb
 * It will auto connect
 */
var mongoConfig = new MongoConfig(config.db);
mongoConfig.connect();

// According to the async property of nodejs
// This flow must be in sequence
async.waterfall([
    function(callback) {
        /**
         * After mongo connection
         * Register all models
         */
        require(config.db.modelPath + '/BaseModel')(config.db.modelPath, callback);
    },
    function(callback) {
        /**
         * Setup express config
         * Start the server
         */
        runApp(callback);
    }
    ], function(err) {
        if (err) {
            console.log(err);
        }
    }
);

var runApp = function(callback) {
    var app = module.exports = express();
    /**
     * Configuration
     */
    require('./config/passport')(passport, config);
    require('./config/express')(app, config, passport);
    require('./config/routes')(app, config, passport);
    var env = process.env.NODE_ENV || 'DEV';

    // development only
    if (env === 'DEV') {
        app.use(errorHandler());
    }

    // production only
    if (env === 'PROD') {
      // TODO
    }

    /**
     * Start Server
     */
    app.set('port', process.env.PORT || 3000);
    http.createServer(app).listen(app.get('port'), function () {
      console.log('Express server listening on port ' + app.get('port'));
    });

    callback(null);
}
