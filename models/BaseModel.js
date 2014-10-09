var fs = require('fs');

var baseModel = function(modelPath, callback) {
    // Register all models
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
