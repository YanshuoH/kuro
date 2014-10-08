// Connect to mongodb
var mongoose = require('mongoose');



function MongoConfig(dbConfig) {
    this.url = dbConfig.url;
    this.options = dbConfig.options;
    this.connect();
}

MongoConfig.prototype.connect = function() {
    mongoose.connect(this.url, this.options);

    // Error handler
    mongoose.connection.on('error', function(err) {
        console.log(err)
    });

    // Reconnect when closed
    mongoose.connection.on('disconnected', function() {
        connect();
    });
}


module.exports = MongoConfig;