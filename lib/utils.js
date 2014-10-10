
exports.addRequiredValidation = function(schema, requiredFields) {
    for (var index=0; index<requiredFields.length; index++) {
        schema.path(requiredFields[index])
            .required(true, 'Field ' + requiredFields[index] + ' is mandatory');
    }
}

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