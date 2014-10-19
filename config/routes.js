var routes = require('../routes/index');
var task = require('../routes/task');
var user = require('../routes/user');
var project = require('../routes/project');

var auth = require('./middlewares/authorization');

/**
 * Route authorization middlewares
 */
var globalAuth = [auth.requiresLogin];

module.exports = function(app, config, passport) {
    // serve index and view partials
    app.get('/', routes.index);
    app.get('/partials/:name', routes.partials);
    app.get('/partials/user/:name', routes.userPartials);

    /**
     * JSON API
    */
    // User
    app.get('/api/user/signout', user.signout);
    app.get('/api/user/:userId', user.show);
    // Custom passport autentication callback
    app.post('/api/user/signin', user.session);
    app.post('/api/user/create', user.editor);
    app.put('/api/user/edit', user.editor);
    app.param('userId', user.load);
    // Project
    app.get('/api/project', globalAuth, project.list);
    app.get('/api/project/:projectId', project.show);
    app.param('projectId', project.load);
    app.put('/api/project/:projectId/edit', project.editor);
    app.post('/api/project/create', project.editor);

    // Task
    app.get('/api/project/:projectId/taskboard', task.list);
    app.get('/api/task/:taskId', task.show);
    app.param('taskId', task.load);
    app.put('/api/task/:taskId/edit', task.editor);
    app.post('/api/task/create', task.editor)

    // redirect all others to the index (HTML5 history)
    app.get('*', routes.index);
}