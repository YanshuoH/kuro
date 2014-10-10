var routes = require('../routes/index');
var api = require('../routes/api');


module.exports = function(app, config) {
    // serve index and view partials
    app.get('/', routes.index);
    app.get('/partials/:name', routes.partials);
    app.get('/partials/user/:name', routes.userPartials);
    // JSON API
    // User
    app.get('/api/user/create', api.userEditor);
    // Project
    app.get('/api/project', api.projectList);
    app.get('/api/project/:projectId', api.projectShow);
    app.param('projectId', api.projectLoad);
    app.put('/api/project/:projectId/edit', api.projectEditor);
    app.post('/api/project/create', api.projectEditor);
    // Task
    app.get('/api/project/:projectId/taskboard', api.taskList);
    app.get('/api/task/:taskId', api.taskShow);
    app.param('taskId', api.taskLoad);
    app.put('/api/task/:taskId/edit', api.taskEditor);
    app.post('/api/task/create', api.taskEditor)

    // redirect all others to the index (HTML5 history)
    app.get('*', routes.index);
}