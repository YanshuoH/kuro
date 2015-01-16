exports.handle = function(res, modelname, typeAction) {
    return res.json({
        status: '200',
        message: typeAction + ' for ' + modelname + 'Success'
    });
}