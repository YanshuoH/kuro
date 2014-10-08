var path = require('path');

var rootPath = path.normalize(__dirname + '/../');

module.exports = {
    root: rootPath,
    app: {
        name: 'Kuro',
        version: '0.0.1'
    }
};