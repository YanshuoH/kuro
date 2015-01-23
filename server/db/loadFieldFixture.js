// Custom load fixture
var async = require('async');
var config = require('../config/config');
var mongoose = require('mongoose');

var MongoConfig = require(config.db.config);
var autoIncrement = require(config.path.lib + '/mongoose-auto-increment');

// load mongo config and create connection
var mongoConfig = new MongoConfig(config.db);
var con = mongoConfig.connectThirdParty();

var StatusModelFile = require(config.db.modelPath + '/StatusModel');
var StatusModel = con.model('StatusModel', StatusModelFile.StatusModelSchema);

var PriorityModelFile = require(config.db.modelPath + '/PriorityModel');
var PriorityModel = con.model('PriorityModel', PriorityModelFile.PriorityModelSchema);

var creatorId =  mongoose.Types.ObjectId('STRINGOF12BT');

var statusFixture = [
    {
        code: 'TD',
        label: 'ToDo'
    },
    {
        code: 'IP',
        label: 'In Progress'
    },
    {
        code: 'NI',
        label: 'Need information'
    },
    {
        code: 'RV',
        label: 'Review'
    },
    {
        code: 'DN',
        label: 'DONE'
    }
];

var priorityFixture = [
    {
        code: 'LW',
        label: 'Low'
    },
    {
        code: 'NM',
        label: 'Normal'
    },
    {
        code: 'CT',
        label: 'Critical'
    },
    {
        code: 'BL',
        label: 'Blocking'
    },
    {
        code: 'UG',
        label: 'Urgent'
    }
]

for (var i=0; i<statusFixture.length; i++) {
    var status = new StatusModel(statusFixture[i]);
    status.creatorId = creatorId;
    status.save(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

for (var i=0; i<priorityFixture.length; i++) {
    var priority = new PriorityModel(priorityFixture[i]);
    priority.creatorId = creatorId;
    priority.save(function(err) {
        if (err) {
            console.log(err);
        }
    });
}