var routes = require('../routes/index');
var api = require('../routes/api');


module.exports = function(app, config) {
    // serve index and view partials
    app.get('/', routes.index);
    app.get('/partials/:name', routes.partials);

    // JSON API
    app.get('/api/name', api.name);
    app.get('/api/board', api.taskList);

    // redirect all others to the index (HTML5 history)
    app.get('*', routes.index);
}