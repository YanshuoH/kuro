var async = require('async');
var config = require('../config/config');
var MongoConfig = require(config.db.config);
// load mongo config and create connection
var mongoConfig = new MongoConfig(config.db);
var con = mongoConfig.connectThirdParty();
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var autoIncrement = require('../lib/mongoose-auto-increment');

setTimeout(function() {
    autoIncrement.initialize(con);
    var TestSchema = new mongoose.Schema({
    })

    var autoIncrementSettings = autoIncrement.makeSettings({ model: 'Test', field: 'testId' });
    TestSchema.plugin(autoIncrement.plugin, autoIncrementSettings);
    // TestSchema.plugin(autoIncrement.plugin, 'Test');
    TestSchema.pre('save', function(next) {
        autoIncrement.proceedIncrementField(this, autoIncrementSettings, function(err, res) {
            console.log(err);
            console.log(res);
            next()
        });
    });
    con.model('Test', TestSchema);
    exports.Test = con.model('Test');

    var test = new exports.Test();
    test.save(function(err) {
        console.log(test);
        if (err) {
            console.log(err);
        }
    });
}, 3000);

