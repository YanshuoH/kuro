var path = require('path');

var rootPath = path.normalize(__dirname + '/../');

module.exports = {
    root: rootPath,
    app: {
        name: 'Kuro',
        version: '0.0.1'
    },
    db: {
        name: 'kuro',
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
    },
    session: {
        sessionOptions: {
            keys: ['whoismostpowerfulinmarvelword', 'ofcoursestanlee'],
            secret: 'kissmyass',
            saveUninitialized: true,
            resave: true,
            cookie: {
                maxAge: 7*24*3600000
            }
        }
    },
    path: {
        // introduce client side static path
        client: path.normalize(rootPath + '/../client'),
        config: path.join(rootPath, '/config'),
        lib: path.join(rootPath, '/lib'),
        models: path.join(rootPath, '/models'),
        repository: path.join(rootPath, '/repository'),
        routes: path.join(rootPath, '/routes')
    }
};
