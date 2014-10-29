/*
 *  Generic require login routing middleware
 */
var msgTemplate = {
    '403' :
        {
            status: 401,
            message: 'You are not authorized'
        },
    '404' :
        {
            status: 404,
            message: 'Page not found'
        }
}


exports.requiresLogin = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send(msgTemplate['403']);
}

exports.project = {
    hasAuthorization: function(req, res, next) {
        var index = req.user.projectIds.indexOf(req.project._id.toString());
        if (index > -1) {
            return next();
        }
        res.send(msgTemplate['403']);
    }
}

exports.task = {
    hasAuthorization: function(req, res, next) {
        var index = req.user.projectIds.indexOf(req.task.projectId.toString());
        if (index > -1) {
            return next();
        }
        res.send(msgTemplate['403']);
    }
}