
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

exports.overrideObj = function(source, change) {
    for (var prop in change) {
        source[prop] = change[prop];
    }
    return source;
}

// check if component is in container
exports.inArray = function(component, container) {
    var length = container.length;
    for(var i = 0; i < length; i++) {
        if(typeof container[i] == 'object') {
            if(exports.arrayCompare(container[i], component)) return true;
        } else {
            if(container[i] == component) return true;
        }
    }
    return false;
}

exports.arrayCompare = function(array1, array2) {
    if (a1.length != a2.length) return false;
    var length = a2.length;
    for (var i = 0; i < length; i++) {
        if (a1[i] !== a2[i]) return false;
    }
    return true;
}

exports.errorHandler = function(res, err) {
    if (typeof(err.status) !== 'undefined') {
        return res.status(err.status).json(err.message);
    } else {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
}

exports.eraseCredentialFields = function(user) {
    user = user.toObject();
    var credentialFields = ['password', 'hashed_password'];
    for (var i=0; i<credentialFields.length; i++) {
        if (user.hasOwnProperty(credentialFields[i])) {
            delete user[credentialFields[i]];
        }
    }
    return user;
}

exports.checkPropertiesExist = function(props, source) {
    var existCheck = false;
    for (var i=0; i<props.length; i++) {
        existCheck = exports.checkPropertyExist(props[i], source);
        if (existCheck) {
            return existCheck;
        }
    }

    return existCheck;
}

exports.checkPropertyExist = function(prop, source) {
    for (var sourceProp in source) {
        if (prop === sourceProp) {
            return true;
        }
    }

    return false;
}