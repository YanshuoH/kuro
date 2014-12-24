
exports.handle = function(res, err) {
    if (typeof(err.status) !== 'undefined') {
        return res.status(err.status).json(err);
    } else {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
}