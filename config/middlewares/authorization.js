/*
 *  Generic require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
    console.log(req.session);
    if (req.isAuthenticated()) {
        return next();
    }
    res.send({
        status: 403,
        message: 'You are not authorized'
    });
}