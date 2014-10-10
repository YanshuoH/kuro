var routes = require('../routes/index');
var api = require('../routes/api');


module.exports = function(app, config) {
    // serve index and view partials
    app.get('/', routes.index);
    app.get('/partials/:name', routes.partials);
    app.get('/partials/user/:name', routes.userPartials);
    // JSON API
    // Project
    app.get('/api/project', api.projectList);
    app.get('/api/project/:projectId', api.projectShow);
    app.param('projectId', api.projectLoad);

    // Task
    app.get('/api/project/:projectId/taskboard', api.taskList);
    app.get('/api/task/:taskId', api.taskShow);
    app.param('taskId', api.taskLoad);

    // POST/PUT
    app.put('/api/task/:taskId/edit', api.taskEditor);
    app.post('/api/task/create', api.taskEditor)
    // redirect all others to the index (HTML5 history)
    app.get('*', routes.index);
}