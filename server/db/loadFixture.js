// Custom load fixture
var async = require('async');
var config = require('../config/config');
var MongoConfig = require(config.db.config);
var autoIncrement = require(config.path.lib + '/mongoose-auto-increment');

// load mongo config and create connection
var mongoConfig = new MongoConfig(config.db);
var con = mongoConfig.connectThirdParty();

autoIncrement.initialize(con);

// register models
var TaskModelFile = require(config.db.modelPath + '/TaskModel');
var TaskModel = con.model('TaskModel', TaskModelFile.TaskModelSchema);

var ProjectModelFile = require(config.db.modelPath + '/ProjectModel');
var ProjectModel = con.model('ProjectModel', ProjectModelFile.ProjectModelSchema);

var UserModelFile = require(config.db.modelPath + '/UserModel')
var UserModel = con.model('UserModel', UserModelFile.UserModelSchema);

var ObjectId = require('mongoose').Types.ObjectId; 

var IdentityCounter = con.model('IdentityCounter');

var ProjectRepository = require(config.path.repository + '/project');
var TaskRepository = require(config.path.repository + '/task');
var UserRepository = require(config.path.repository + '/user');
/*
 * Important params!!!
 * Clear database or not
 */
var removeAll = false;

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
        // function(callback) {
        //     IdentityCounter.remove({}, function(err) {
        //         console.log('>> IdentityCounter  collectionclear');
        //         callback();
        //     })
        // },
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
            insertAction(userFixture, UserRepository, UserModel, null, null, callback);
        },
        // Insert project 
        function(userId, callback) {
            console.log('>> Insert Project');
            insertAction(projectFixture, ProjectRepository, ProjectModel, 'creatorId', userId.toString(), callback);
        },
        function(projectId, userId, callback) {
            UserModel.load(userId.toString(), {}, function(err, user) {
                if (err) console.log(err);
                user.projectIds.push(projectId.toString());
                UserRepository.save(user, function(err) {
                    if (err) console.log(err);
                    callback(null, projectId, userId);
                });
            });
        },
        // Insert tasks
        function(projectId, userId, callback) {
            console.log('>> Insert Task');
            insertAction(taskFixture, TaskRepository, TaskModel, 'projectId', projectId, callback, userId);
        }
    ], function(err) {
        if (err) console.log(err);
        cb();
    })
}

function insertAction(dataFixture, dataRepository, dataModel, parentName, parentId, cb, userId) {
    async.each(dataFixture, function(data, callback) {
        if (parentName && parentId) {
            data[parentName] = parentId;
        }
        if (parentName == 'creatorId') {
            data.adminIds = [parentId];
            data.userIds = [parentId];
        }
        if (parentName == 'projectId') {
            data.creatorId = userId;
            data.projectId = parentId;
        }
        var unit = new dataModel(data);
        dataRepository.save(unit, function(err) {
            if (err) console.log(err);
            if (parentName === 'projectId') {
                callback();
            } else {
                callback(unit._id);
            }
        });
    }, function(unitId) {
        if (parentName === 'creatorId') {
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

    },
    {
        title: "test2",
        description: "test description 2",
    },
    {
        title: "test3",
        description: "test description 3",
    }
]

var projectFixture = [
    {
        ref: "DFT1",
        title: "default1",
        description: "default project 1"
    },
]

var userFixture = [
    {
        username: "test1",
        email: "test1@test.com",
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
