/*
 * Author codetunnel@github
 * Modified by YANSHUO HUANG
 * Custome node module for mongoose, for individual project
 */

// Module Scope
var mongoose = require('mongoose');
var extend = require('extend');
var counterSchema;
var IdentityCounter;

// Initialize plugin by creating counter collection in database.
exports.initialize = function (connection) {
    try {
        IdentityCounter = connection.model('IdentityCounter');
    } catch (ex) {
        if (ex.name === 'MissingSchemaError') {
            // Create new counter schema.
            counterSchema = new mongoose.Schema({
                model: { type: String, require: true },
                field: { type: String, require: true },
                projectId: { type: mongoose.Schema.ObjectId},
                count: { type: Number, default: 0 }
            });

            // Create a unique index using the "field", "model", "project" fields.
            counterSchema.index({ field: 1, model: 1, projectId: 1 }, { unique: true, required: true, index: -1 });

            // Create model using new schema.
            IdentityCounter = connection.model('IdentityCounter', counterSchema);
        }
        else {
            throw ex;
        }
    }
};

// The function to use when invoking the plugin on a custom schema.
exports.plugin = function (schema, options) {

    // If we don't have reference to the counterSchema or the IdentityCounter model then the plugin was most likely not
    // initialized properly so throw an error.
    if (!counterSchema || !IdentityCounter) throw new Error("mongoose-auto-increment has not been initialized");

    // Default settings and plugin scope variables.
    var settings = {
            model: null, // The model to configure the plugin for.
            field: '_id', // The field the plugin should track.
            startAt: 1, // The number the count should start at.
            incrementBy: 1 // The number by which to increment the count each time.
        },
        fields = {}, // A hash of fields to add properties to in Mongoose.
        ready = false; // True if the counter collection has been updated and the document is ready to be saved.

    switch (typeof(options)) {
        // If string, the user chose to pass in just the model name.
        case 'string':
            settings.model = options;
            break;
        // If object, the user passed in a hash of options.
        case 'object':
            extend(settings, options);
            break;
    }

    // Add properties for field in schema.
    fields[settings.field] = {
        type: Number,
        require: true
    };
    schema.add(fields);

    // Create a unique group of fields
    var indexSet = { _id: 1 };
    var indexExtend = {};
    indexExtend[settings['field']] = 1;
    indexExtend[settings['idField']] = 1;

    if (settings.model === 'TaskModel') {
        indexSet = indexExtend;
    } else {
        extend(indexSet, indexExtend);

    }
    schema.index(indexSet, { unique: true });

    // // Declare a function to get the next counter for the model/schema.
    // var nextCount = function (callback) {
    //     IdentityCounter.findOne({
    //         model: settings.model,
    //         field: settings.field
    //     }, function (err, counter) {
    //         if (err) return callback(err);
    //         callback(null, counter === null ? settings.startAt : counter.count + settings.incrementBy);
    //     });
    // };
    // // Add nextCount as both a method on documents and a static on the schema for convenience.
    // schema.method('nextCount', nextCount);
    // schema.static('nextCount', nextCount);

    // // Declare a function to reset counter at the start value - increment value.
    // var resetCount = function (callback) {
    //     IdentityCounter.findOneAndUpdate(
    //         { model: settings.model, field: settings.field },
    //         { count: settings.startAt - settings.incrementBy },
    //         { new: true }, // new: true specifies that the callback should get the updated counter.
    //         function (err) {
    //             if (err) return callback(err);
    //             callback(null, settings.startAt);
    //         }
    //     );
    // };
    // // Add resetCount as both a method on documents and a static on the schema for convenience.
    // schema.method('resetCount', resetCount);
    // schema.static('resetCount', resetCount);

    // Every time documents in this schema are saved, run this logic.
    schema.pre('save', function(next) {
        // Get reference to the document being saved.
        var doc = this;

        var counterQuery = {
                model: settings.model,
                field: settings.field
            };
        if (settings.model === 'TaskModel') {
            extend(counterQuery, { projectId: doc[settings.idField] });
        }
        // Find the counter for this model and the relevant field.
        IdentityCounter.findOne(counterQuery, function(err, counter) {
            if (!counter) {
                // If no counter exists then create one and save it.
                var counterData = {
                    model: settings.model,
                    field: settings.field,
                    count: settings.startAt - settings.incrementBy
                }
                if (settings.model === 'TaskModel') {
                    extend(counterData, { projectId: doc[settings.idField] });
                }
                counter = new IdentityCounter(counterData);
                counter.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        ready = true;
                    }
                });
            }
            else {
                ready = true;
            }
        });

        // If the document already has the field we're interested in and that field is a number then run this logic
        // to give the document a number ID that is incremented by the amount specified in relation to whatever the
        // last generated document ID was.
        if (typeof(doc[settings.field]) !== 'number') {
            // Declare self-invoking save function.
            (function save() {
                if (ready) {
                    // Find the counter collection entry for this model and field and update it.
                    var identityCounterQuery = {
                        model: settings.model,
                        field: settings.field
                    }
                    if (settings.model === 'TaskModel') {
                        extend(identityCounterQuery, { projectId: doc[settings.idField].toString() });
                    }
                    IdentityCounter.findOneAndUpdate(
                        // IdentityCounter documents are identified by the model and field that the plugin was invoked for.
                        identityCounterQuery,
                        // Increment the count by `incrementBy`.
                        { $inc: { count: settings.incrementBy } },
                        // new:true specifies that the callback should get the counter AFTER it is updated (incremented).
                        { new: true },
                        // Receive the updated counter.
                        function (err, updatedIdentityCounter) {
                            if (err) {
                                return next(err);
                            } else {
                                // If there are no errors then go ahead and set the document's field to the current count.
                                doc[settings.field] = updatedIdentityCounter.count;
                                // Continue with default document save functionality.
                                next();
                            }
                        }
                    );
                } else {
                    var retry = setTimeout(save, 5);
                }
            })();
        }
        // If the document does not have the field we're interested in or that field isn't a number AND the user did
        // not specify that we should increment on updates, then just continue the save without any increment logic.
        else {
            next();
        }
    });
};
