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

var ProjectModelFile = require(config.db.modelPath + '/ProjectModel');
var ProjectModel = con.model('ProjectModel', ProjectModelFile.ProjectModelSchema);

var UserModelFile = require(config.db.modelPath + '/UserModel')
var UserModel = con.model('UserModel', UserModelFile.UserModelSchema);

var ObjectId = require('mongoose').Types.ObjectId; 

/*
 * Important params!!!
 * Clear database or not
 */
var removeAll = true;

async.waterfall([
    // First, remove all data in db
    function(callback) {
        if (removeAll) {
            clearDatabase(callback);
        } else {
            callback();
        }
    },
    // Second, insert data in db in order
    function(callback) {
        handleInsertData(callback);
    }
    ], function(err, result) {
        console.log('==== Finished ====');
        mongoConfig.disconnect();
    }
);

function clearDatabase(cb) {
    async.waterfall([
        function(callback) {
            TaskModel.remove({}, function(err) {
                if (err) {
                    console.log(err);
                }
                console.log('>> Task collection clear');
                callback(err);
            });
        },
        function(callback) {
            ProjectModel.remove({}, function(err) {
                if (err) {
                    console.log(err);
                }
                console.log('>> Project collection clear');
                callback(err);
            });
        },
        function(callback) {
            UserModel.remove({}, function(err) {
                if (err) {
                    console.log(err);
                }
                console.log('>> User collection clear');
                callback(err);
            })
        }
    ], function(err) {
        cb();
    });
}

function handleInsertData(cb) {
    async.waterfall([
        // Insert User 
        function(callback) {
            console.log('>> Insert User');
            insertAction(userFixture, UserModel, null, null, callback);
        },
        // Insert project 
        function(userId, callback) {
            console.log('>> Insert Project');
            insertAction(projectFixture, ProjectModel, 'creator', userId.toString(), callback);
        },
        function(projectId, userId, callback) {
            UserModel.load(userId.toString(), function(err, user) {
                if (err) console.log(err);
                user.project.push(projectId);
                user.save(function(err) {
                    if (err) console.log(err);
                    callback(null, projectId);
                });
            });
        },
        // Insert tasks
        function(projectId, callback) {
            console.log('>> Insert User');
            insertAction(taskFixture, TaskModel, 'project', projectId.toString(), callback);
        }
    ], function(err) {
        if (err) console.log(err);
        cb();
    })
}

function insertAction(dataFixture, dataModel, parentName, parentId, cb) {
    async.each(dataFixture, function(data, callback) {
        if (parentName && parentId) {
            data[parentName] = parentId;
        }
        var unit = new dataModel(data);
        unit.save(function(err) {
            if (err) console.log(err);
            if (parentName === 'project') {
                callback();
            } else {
                callback(unit._id);
            }
        });
    }, function(unitId) {
        if (parentName === 'creator') {
            cb(null, unitId, parentId);
        } else {
            cb(null, unitId);
        }
    });
}
var taskFixture = [
    {
        title: "test1",
        description: "test description 1",
        project: "54354bee30a6f3341035d361"

    },
    {
        title: "test2",
        description: "test description 2",
        project: "54354bee30a6f3341035d361"
    },
    {
        title: "test3",
        description: "test description 3",
        project: "54354bee30a6f3341035d361"
    }
]

var projectFixture = [
    {
        ref: "DFT",
        title: "default",
        description: "default project"
    },
]

var userFixture = [
    {
        username: "yanshuoh",
        email: "test@test.com",
        password: "test"
    }
]



// var dataFixture = userFixture;
// var model = UserModel;
// // use async, close connection when all saves are done.
// async.each(dataFixture, function(data, callback) {
//     var data = new model(data);
//     data.save(function(err) {
//         if (err) {
//             callback(err);
//         } else {
//             callback();
//         }
//     });
// }, function(err) {
//     if (err) {
//         console.log(err);
//     } else {
//         mongoConfig.disconnect();
//     }
// });
