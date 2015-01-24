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
        label: 'ToDo',
        weight: 1
    },
    {
        code: 'IP',
        label: 'In Progress',
        weight: 2
    },
    {
        code: 'NI',
        label: 'Need information',
        weight: 3
    },
    {
        code: 'RV',
        label: 'Review',
        weight: 4
    },
    {
        code: 'DN',
        label: 'DONE',
        weight: 5
    }
];

var priorityFixture = [
    {
        code: 'LW',
        label: 'Low',
        weight: 0
    },
    {
        code: 'NM',
        label: 'Normal',
        weight: 1
    },
    {
        code: 'CT',
        label: 'Critical',
        weight: 2
    },
    {
        code: 'BL',
        label: 'Blocking',
        weight: 3
    },
    {
        code: 'UG',
        label: 'Urgent',
        weight: 4
    }
];

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