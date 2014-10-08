// Connect to mongodb
var mongoose = require('mongoose');



function MongoConfig(dbConfig) {
    this.uri = dbConfig.uri;
    this.options = dbConfig.options;
}

MongoConfig.prototype.connect = function() {
    mongoose.connect(this.uri, this.options);

    // Error handler
    mongoose.connection.on('error', function(err) {
        console.log(err)
    });

    // Reconnect when closed
    mongoose.connection.on('disconnected', function() {
        connect();
    });
}

MongoConfig.prototype.connectThirdParty = function() {
    this.options.server.auto_reconnect = false;
    this.options.server.poolSize = 5;
    console.log('==== Connect by Third Party ====');
    var con = mongoose.createConnection(this.uri, this.options);
    mongoose.connection.on('error', function(err) {
        console.log(err);
    });
    this.con = con;
    return con;
}

MongoConfig.prototype.disconnect = function() {
    this.con.close();
    console.log('==== Disconnect ====');
}

MongoConfig.prototype.getCon = function() {
    return this.con;
}

module.exports = MongoConfig;