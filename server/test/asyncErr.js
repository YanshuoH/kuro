var async = require('async');

async.waterfall([
    function(callback) {
        var err = 'fuck you';
        callback(err);
    },
    function(arg1, arg2) {
        var arg1 = 'arg1';
        var arg2 = 'arg2';
        console.log(arg1, arg2);
        callback(null, arg1);
    }

], function(err, res) {
    console.log(err);
    console.log(res);
})
