// Custom load fixture
var async = require('async');
var config = require('../config/config');
var MongoConfig = require(config.db.config);

// load mongo config and create connection
var mongoConfig = new MongoConfig(config.db);
var con = mongoConfig.connectThirdParty();

// register models
var TaskModelFile = require(config.db.modelPath + '/TaskModel');
var TaskModel = con.model('TaskModel', TaskModelFile.TaskModelSchema);

var dataFixture = [
    {
        title: "test1",
        description: "test description 1"
    },
    {
        title: "test2",
        description: "test description 2"
    },
    {
        title: "test3",
        description: "test description 3"
    }
]
// use async, close connection when all saves are done.
async.each(dataFixture, function(data, callback) {
    var task = new TaskModel(data);
    task.save(function(err) {
        if (err) {
            callback(err);
        } else {
            callback();
        }
    });
}, function(err) {
    if (err) {
        console.log(err);
    } else {
        mongoConfig.disconnect();
    }
});
// for (var index=0; index<dataFixture.length; index++) {
//     var task = new TaskModel(dataFixture[index]);
//     task.save(function(err) {
//         if (err) {
//             console.log(err);
//         }
//     });
// }

// mongoConfig.disconnect();
