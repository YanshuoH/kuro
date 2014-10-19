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
        email: "hys@gmail.com",
        password: "test"
    }
]

var dataFixture = userFixture;
var model = UserModel;
// use async, close connection when all saves are done.
async.each(dataFixture, function(data, callback) {
    var data = new model(data);
    data.save(function(err) {
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
