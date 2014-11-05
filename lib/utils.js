
exports.addRequiredValidation = function(schema, requiredFields) {
    for (var index=0; index<requiredFields.length; index++) {
        schema.path(requiredFields[index])
            .required(true, 'Field ' + requiredFields[index] + ' is mandatory');
    }
};

exports.modelStatics = {
    loadQuery: function(id, options) {
        var criteria = options.criteria || {};
        criteria._id = id;
        // This find function is nested nativelly in mongoose.Schema.statics
        var query = this.findOne(criteria);
        if (options.where) {
            query.where(options.where.field).in(options.where.value);
        }
        return query;
    },
    load: function(id, options, cb) {
        var query = this.loadQuery(id, options);
        query.exec(cb);
    },
    loadJson: function(id, options, cb) {
        var query = this.loadQuery(id, options);
        query.lean().exec(cb);
    },
    loadByShortIdQuery: function(shortId, options) {
        var criteria = options.criteria || {};
        criteria.shortId = shortId;
        var query = this.findOne(criteria);
        return query;
    },
    loadByShortId: function(shortId, options, cb) {
        var query = this.loadByShortIdQuery(shortId, options);
        query.exec(cb);
    },
    loadJsonByShortId: function(shortId, options, cb) {
        var query = this.loadByShortIdQuery(shortId, options);
        query.lean().exec(cb);
    },
    listQuery: function(options) {
        var criteria = options.criteria || {};
        var query = this.find(criteria);
        if (options.select) {
            query.select(options.select.fields);
        }
        return query;
    },
    list: function (options, cb) {
        var query = this.listQuery(options);
        query.exec(cb);
    },
    listToJson: function(options, cb) {
        var query = this.listQuery(options);
        query.lean().exec(cb);
    }
};

exports.mergeObj = function (obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}