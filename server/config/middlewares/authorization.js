/*
 *  Generic require login routing middleware
 */
var msgTemplate = {
    'login' : {
        status: 401
        message: 'Please login with your account'
    },
    'authorize': {
        status: 401
        message: 'This account does not have access to the project'
    }
}


exports.requiresLogin = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json(msgTemplate['login']);
}

exports.project = {
    hasAuthorization: function(req, res, next) {
        var index = req.user.projectIds.indexOf(req.project._id.toString());
        if (index > -1) {
            return next();
        }
        res.status(401).json(msgTemplate['authorize']);
    }
}

exports.task = {
    hasAuthorization: function(req, res, next) {
        var index = req.user.projectIds.indexOf(req.task.projectId.toString());
        if (index > -1) {
            return next();
        }
        res.status(401).json(msgTemplate['authorize']);
    }
}