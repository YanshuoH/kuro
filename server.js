
/**
 * Module dependencies
 */
var http = require('http');
var express = require('express');

var errorHandler = require('errorhandler');

var app = module.exports = express();
var config = require(__dirname + '/config/config')
/**
 * Configuration
 */
require('./config/express')(app, config);
require('./config/routes')(app, config);

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
