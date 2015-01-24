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

var StatusModelFile = require(config.db.modelPath + '/StatusModel');
var StatusModel = con.model('StatusModel', StatusModelFile.StatusModelSchema);

var PriorityModelFile = require(config.db.modelPath + '/PriorityModel');
var PriorityModel = con.model('PriorityModel', PriorityModelFile.PriorityModelSchema);

var ObjectId = require('mongoose').Types.ObjectId; 

var IdentityCounter = con.model('IdentityCounter');

var ProjectRepository = require(config.path.repository + '/project');
var TaskRepository = require(config.path.repository + '/task');
var UserRepository = require(config.path.repository + '/user');

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
        function(user, callback) {
            console.log('>> Insert Project');
            async.waterfall([
                function(statusCallback){
                    StatusModel.list({}, function(err, statusList) {
                        var statusIds = [];
                        for (var i=0; i<statusList.length; i++) {
                            statusIds.push(statusList[i]._id);
                        }
                        statusCallback(null, statusIds);
                    });
                }, function(statusIds, priorityCallback) {
                    PriorityModel.list({}, function(err, priorityList) {
                        var priorityIds = [];
                        for (var i=0; i<priorityList.length; i++) {
                            priorityIds.push(priorityList[i]._id);
                        }
                        priorityCallback(null, statusIds, priorityIds);
                    });
                }], function(err, statusIds, priorityIds) {
                    insertAction(projectFixture, ProjectRepository, ProjectModel, 'creatorId', user._id.toString(), callback, statusIds, priorityIds);
            });
        },
        function(project, userId, callback) {
            UserModel.load(userId.toString(), {}, function(err, user) {
                if (err) console.log(err);
                user.projectIds.push(project._id.toString());
                UserRepository.save(user, function(err) {
                    if (err) console.log(err);
                    callback(null, project, userId);
                });
            });
        },
        // Insert tasks
        function(project, userId, callback) {
            console.log('>> Insert Task');
            insertAction(taskFixture, TaskRepository, TaskModel, 'projectId', project, callback, userId);
        }
    ], function(err) {
        if (err) console.log(err);
        cb();
    })
}

function insertAction(dataFixture, dataRepository, dataModel, parentName, parentId, cb, userId, priorityIds) {
    async.each(dataFixture, function(data, callback) {
        if (parentName && parentId) {
            data[parentName] = parentId;
        }
        // Is project model
        if (parentName == 'creatorId') {
            data.adminIds = [parentId];
            data.userIds = [parentId];
            // userId, in place of statusIds
            data.statusData = userId;
            data.priorityData = priorityIds;
        }
        // Is taskm model
        if (parentName == 'projectId') {
            data.creatorId = userId;
            // project model in place of parentId
            data.projectId = parentId._id;
            data.status = parentId.statusData[data.status];
            data.priority = parentId.priorityData[data.priority];
        }
        var unit = new dataModel(data);
        dataRepository.save(unit, function(err) {
            if (err) console.log(err);
            if (parentName === 'projectId') {
                callback();
            } else {
                callback(unit);
            }
        });
    }, function(unit) {
        if (parentName === 'creatorId') {
            cb(null, unit, parentId);
        } else {
            cb(null, unit);
        }
    });
}
var taskFixture = [
    {
        title: "Low Todo",
        description: "test description 1",
        status: 0,
        priority: 0
    },
    {
        title: "Normal Todo",
        description: "test description 2",
        status: 0,
        priority: 1
    },
    {
        title: "Urgent QA",
        description: "test description 3",
        status: 1,
        priority: 1
    },
    {
        title: "Urgent Done",
        description: "test description 3",
        status: 2,
        priority: 2
    },
    {
        title: "Low Done",
        description: "test description 3",
        status: 2,
        priority: 0
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
