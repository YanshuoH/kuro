
exports.addRequiredValidation = function(schema, requiredFields) {
    for (var index=0; index<requiredFields.length; index++) {
        schema.path(requiredFields[index])
            .required(true, 'Field ' + requiredFields[index] + ' is mandatory');
    }
};

exports.modelStatics = {
    load: function(id, cb) {
        this.findOne({ _id: id }).exec(cb);
    },
    loadJson: function(id, cb) {
        this.findOne({ _id: id }).lean().exec(cb);
    },
    list: function (options, cb) {
        var criteria = options.criteria || {};
        var query = this.find(criteria);
        if (options.where) {
            query.where(options.where.field).in(options.where.value);
        }
        query.exec(cb);
    },
    listToJson: function(options, cb) {
        var criteria = options.criteria || {};
        var query = this.find(criteria).lean();
        if (options.select) {
            query.select(options.select);
        }
        query.exec(cb);
    }
};

exports.mergeObj = function (obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}