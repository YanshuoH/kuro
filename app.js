
/**
 * Module dependencies
 */

var express = require('express');

  // http = require('http'),
  // path = require('path');

var app = module.exports = express();
var config = require(__dirname + './config/config')
/**
 * Configuration
 */
require('./config/express')(app, config);
require('./config/routes')(app, config);

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  app.use(errorHandler());
}

// production only
if (env === 'production') {
  // TODO
}


/**
 * Start Server
 */
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
