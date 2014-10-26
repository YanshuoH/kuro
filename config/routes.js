var routes = require('../routes/index');
var task = require('../routes/task');
var user = require('../routes/user');
var project = require('../routes/project');

var auth = require('./middlewares/authorization');

/**
 * Route authorization middlewares
 */
var globalAuth = [auth.requiresLogin];
var projectAuth = [auth.requiresLogin, auth.project.hasAuthorization];
var taskAuth = [auth.requiresLogin, auth.task.hasAuthorization];

module.exports = function(app, config, passport) {
    // serve index and view partials
    app.get('/', routes.index);
    app.get('/partials/:name', routes.partials);
    app.get('/partials/user/:name', routes.userPartials);
    app.get('/partials/project/:name', routes.projectPartials);
    app.get('/partials/task/:name', routes.taskPartials);
    /**
     * JSON API
    */
    // User
    app.get('/api/user/signout', user.signout);
    // Custom passport autentication callback
    app.post('/api/user/signin', user.signin);
    app.post('/api/user/create', user.editor);
    app.put('/api/user/edit', globalAuth, user.editor);
    app.get('/api/user/info', globalAuth, user.show);
    app.get('/api/user/:userId', user.show);
    app.param('userId', user.load);
    // Project
    app.get('/api/project', globalAuth, project.listByIds);
    app.get('/api/project/:projectId', projectAuth, project.show);
    app.param('projectId', project.load);
    app.put('/api/project/:projectId/edit', projectAuth, project.update);
    app.post('/api/project/create', globalAuth, project.create);

    // Task
    app.get('/api/project/:projectId/taskboard', projectAuth, task.listByProject);
    app.get('/api/task/:taskId', taskAuth, task.show);
    app.param('taskId', task.load);
    app.put('/api/task/:taskId/edit', task.editor);
    app.post('/api/task/create', task.editor);

    // redirect all others to the index (HTML5 history)
    app.get('*', routes.index);
}