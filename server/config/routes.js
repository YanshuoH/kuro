var routes = require('../routes/index');
var task = require('../routes/task');
var user = require('../routes/user');
var status = require('../routes/status');
var priority = require('../routes/priority');
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
    app.get('/', routes.home);
    app.get('/home', routes.home);
    app.get('/partials/:name', routes.partials);
    app.get('/partials/user/:name', routes.userPartials);
    app.get('/partials/project/:name', routes.projectPartials);
    app.get('/partials/task/:name', routes.taskPartials);
    app.get('/partials/include/:name', routes.includePartials);
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
    app.get('/api/user/login_check', user.loginCheck);
    app.get('/api/user/:userId', user.show);
    app.param('userId', user.load);
    // Project
    app.get('/api/project', globalAuth, project.listByIds);
    app.get('/api/project/:projectShortId', projectAuth, project.show);
    app.param('projectShortId', project.loadByShortId);
    app.put('/api/project/:projectShortId/edit', projectAuth, project.update);
    app.put('/api/project/:projectShortId/priority/create', projectAuth, project.createAndAddPriority);
    app.put('/api/project/:projectShortId/status/create', projectAuth, project.createAndAddStatus);
    app.post('/api/project/create', globalAuth, project.create);
    app.post('/api/project/:projectShortId/user/add', projectAuth, project.addUser);

    // Task
    app.get('/api/project/:projectShortId/taskboard', projectAuth, task.listByProject);
    app.get('/api/project/:projectShortId/task/:taskShortId', taskAuth, task.show);
    app.param('taskShortId', task.loadByShortId);
    app.put('/api/project/:projectShortId/task/:taskShortId/edit', taskAuth, task.update);
    app.put('/api/project/:projectShortId/task/:taskShortId/edit/activity', taskAuth, task.updateActivity);
    app.post('/api/project/:projectShortId/task/create', projectAuth, task.create);

    // Fields
    // Status
    app.get('/api/status/default', status.loadDefaultList);
    app.get('/api/status/:statusId', status.show);
    app.get('/api/project/:projectShortId/status', status.loadStatusByProject);
    app.param('statusId', status.loadById);
    app.post('/api/status/create', globalAuth, status.create);
    // Priority
    app.get('/api/priority/default', priority.loadDefaultList);
    app.get('/api/priority/:priorityId', priority.show);
    app.get('/api/project/:projectShortId/priority', priority.loadPriorityByProject);
    app.param('priorityId', priority.loadById);
    app.post('/api/priority/create', globalAuth, priority.create);

    // redirect all others to the index (HTML5 history)
    app.get('*', routes.index);
}