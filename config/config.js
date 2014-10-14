var path = require('path');

var rootPath = path.normalize(__dirname + '/../');

module.exports = {
    root: rootPath,
    app: {
        name: 'Kuro',
        version: '0.0.1'
    },
    db: {
        uri: 'mongodb://localhost:27017/kuro',
        config: path.join(rootPath, '/db/mongo_config'),
        modelPath: path.join(rootPath, 'models'),
        options: {
            server: {
                auto_reconnect: true,
                socketOptions: {
                    KeepAlive: 1,
                },
                poolSize: 5
            }
        }
    }
};