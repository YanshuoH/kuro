var fs = require('fs');

var baseModel = function(config, callback) {
    var con = require('mongoose');
    var modelPath = config.db.modelPath;
    var autoIncrement = require(config.path.lib + '/mongoose-auto-increment');
    // Initialize autoIncrement module for connection
    autoIncrement.initialize(con);

    // Then register all models
    fs.readdir(modelPath, function(err, files) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            for (var i=0; i<files.length; i++) {
                if (files[i] === 'BaseModel.js') {
                    continue;
                }
                require(modelPath + '/' + files[i]);
            }
            callback();
        }
    });
}


module.exports = baseModel;
