/*
    ./objects/message.js

    The primary object of msngr; handles all message sending, receiving and binding.
*/
msngr.extend((function(external, internal) {
    "use strict";

    internal.objects = internal.objects || {};
    internal.option = function(opt, handler) {
        internal.option[opt] = handler;
    };

    var messageIndex = internal.objects.memory();
    var payloadIndex = internal.objects.memory();

    var handlers = {};
    var handlerCount = 0;

    var payloads = {};
    var payloadCount = 0;

    var boundDOMPaths = {};
    var boundCount = 0;

    Object.defineProperty(internal, "handlerCount", {
        get: function() {
            return handlerCount;
        }
    });

    Object.defineProperty(internal, "boundCount", {
        get: function() {
            return boundCount;
        }
    });

    Object.defineProperty(internal, "payloadCount", {
        get: function() {
            return payloadCount;
        }
    });

    internal.reset = function() {
        handlers = {};
        boundDOMPaths = {};
        handlerCount = 0;
        boundCount = 0;
        messageIndex.clear();
        payloadIndex.clear();
        payloads = {};
        payloadCount = 0;
    };

    internal.processOpts = function(opts, message, payload, callback) {
        var optProcessors = [];
        for (var key in opts) {
            if (opts.hasOwnProperty(key) && external.exist(internal.option[key])) {
                optProcessors.push({
                    method: internal.option[key],
                    params: [message, payload, opts]
                });
            }
        }

        // Short circuit for no options
        if (optProcessors.length === 0) {
            return callback.apply(this, [payload]);
        }

        // Long circuit to do stuff (du'h)
        var execs = internal.objects.executer(optProcessors);

        execs.parallel(function(results) {
            var result = payload;
            if (external.exist(results) && results.length > 0) {
                for (var i = 0; i < results.length; ++i) {
                    if (external.exist(results[i])) {
                        result = external.merge(results[i], result);
                    }
                }
            }
            callback.apply(this, [result]);
        });
    };

    internal.domListener = function(event) {
        var node = this;
        var path = external.getDomPath(node);

        if (external.exist(boundDOMPaths[path])) {
            if (external.exist(boundDOMPaths[path][event.type])) {
                return boundDOMPaths[path][event.type].emit();
            }
        }
    };

    internal.objects.message = function(topic, category, subcategory) {
        var msg = undefined;
        if (!external.exist(topic)) {
            throw internal.InvalidParametersException("msngr");
        }

        if (!external.isObject(topic) && !external.isString(topic)) {
            throw internal.InvalidParametersException("msngr");
        }

        if (external.isEmptyString(topic)) {
            throw internal.InvalidParametersException("msngr");
        }

        if (external.isObject(topic)) {
            msg = external.copy(topic);
        } else {
            msg = {};
            msg.topic = topic;

            if (!external.isEmptyString(category)) {
                msg.category = category;
            }

            if (!external.isEmptyString(subcategory)) {
                msg.subcategory = subcategory;
            }
        }

        // Normalize message to lowercase
        msg.topic = (msg.topic) ? msg.topic.toLowerCase() : msg.topic;
        msg.category = (msg.category) ? msg.category.toLowerCase() : msg.category;
        msg.subcategory = (msg.subcategory) ? msg.subcategory.toLowerCase() : msg.subcategory;

        var options = {};
        var counts = {
            emits: 0,
            persists: 0,
            options: 0,
            ons: 0,
            onces: 0,
            binds: 0
        };

        var explicitEmit = function(payload, ids, callback) {
            var ids = ids || messageIndex.query(msg) || [];

            internal.processOpts(options, msg, payload, function(result) {
                var methods = [];
                var toDrop = [];
                for (var i = 0; i < ids.length; ++i) {
                    var obj = handlers[ids[i]];
                    methods.push({
                        method: obj.handler,
                        params: [result, msg]
                    });

                    if (obj.once === true) {
                        toDrop.push(obj.handler);
                    }
                }

                var execs = internal.objects.executer(methods);

                for (var i = 0; i < toDrop.length; ++i) {
                    msgObj.drop(toDrop[i]);
                }

                execs.parallel(callback);

            });
        };

        var fetchPersisted = function() {
            var ids = payloadIndex.query(msg);

            var fpay;

            if (ids.length === 0) {
                return undefined;
            }

            if (ids.length === 1) {
                return payloads[ids[0]];
            }

            for (var i = 0; i < ids.length; ++i) {
                fpay = external.extend(innerPay, fpay);
            }

            return fpay;
        };

        var msgObj = {
            option: function(key, value) {
                if (!external.exist(key) || !external.isString(key)) {
                    throw internal.InvalidParametersException("option");
                }

                options[key] = value;
                counts.options = counts.options + 1;

                return msgObj;
            },
            emit: function(payload, callback) {
                if (external.isFunction(payload)) {
                    callback = payload;
                    payload = undefined;
                }
                explicitEmit(payload, undefined, callback);
                counts.emits = counts.emits + 1;

                return msgObj;
            },
            persist: function(payload) {
                if (payload === undefined) {
                    payload = null;
                }

                var ids = payloadIndex.query(msg);
                if (ids.length === 0) {
                    var id = payloadIndex.index(msg);
                    payloads[id] = payload;
                    ids = [id];
                } else {
                    for (var i = 0; i < ids.length; ++i) {
                        payloads[ids[i]] = external.merge(payload, payloads[ids[i]]);
                    }
                }

                var fpay = fetchPersisted();

                ++payloadCount;

                counts.persists = counts.persists + 1;

                return msgObj.emit(fpay);
            },
            cease: function() {
                var ids = payloadIndex.query(msg);

                for (var i = 0; i < ids.length; ++i) {
                    delete payloads[ids[i]];
                    --payloadCount;
                }

                return msgObj;
            },
            on: function(handler) {
                var id = messageIndex.index(msg);
                handlers[id] = {
                    handler: handler,
                    context: (msg.context || this),
                    once: false
                };
                handlerCount++;

                var payload = fetchPersisted();
                if (payload !== undefined) {
                    explicitEmit(payload, [id], undefined);
                }
                counts.ons = counts.ons + 1;

                return msgObj;
            },
            once: function(handler) {
                var id = messageIndex.index(msg);
                handlers[id] = {
                    handler: handler,
                    context: (msg.context || this),
                    once: true
                };
                handlerCount++;

                var payload = fetchPersisted();
                if (payload !== undefined) {
                    explicitEmit(payload, [id], undefined);
                }
                counts.onces = counts.onces + 1;

                return msgObj;
            },
            bind: function(element, event) {
                var node = external.findElement(element);
                var path = external.getDomPath(node);

                if (!external.exist(boundDOMPaths[path])) {
                    boundDOMPaths[path] = {};
                }

                boundDOMPaths[path][event] = msgObj;

                node.addEventListener(event, internal.domListener);

                ++boundCount;
                counts.binds = counts.binds + 1;

                return msgObj;
            },
            drop: function(handler) {
                var ids = messageIndex.query(msg);
                if (ids.length > 0) {
                    for (var i = 0; i < ids.length; ++i) {
                        var id = ids[i];
                        if (handlers[id].handler === handler) {
                            delete handlers[id];
                            handlerCount--;

                            messageIndex.delete(id);
                        }
                    }
                }

                return msgObj;
            },
            unbind: function(element, event) {
                var node = external.findElement(element);
                var path = external.getDomPath(node);

                if (external.exist(boundDOMPaths[path])) {
                    if (external.exist(boundDOMPaths[path][event])) {
                        node.removeEventListener(event, internal.domListener);

                        delete boundDOMPaths[path][event];

                        --boundCount;
                    }
                }

                return msgObj;
            },
            dropAll: function() {
                var ids = messageIndex.query(msg);
                if (ids.length > 0) {
                    for (var i = 0; i < ids.length; ++i) {
                        var id = ids[i];
                        delete handlers[id];
                        handlerCount--;

                        messageIndex.delete(id);
                    }
                }

                return msgObj;
            }
        };

        // Expose the raw message object itself via a message property.
        // Do not allow modification.
        Object.defineProperty(msgObj, "message", {
            get: function() {
                return msg;
            }
        });

        Object.defineProperty(msgObj, "topic", {
            get: function() {
                return msg.topic;
            }
        });

        Object.defineProperty(msgObj, "category", {
            get: function() {
                return msg.category;
            }
        });

        Object.defineProperty(msgObj, "subcategory", {
            get: function() {
                return msg.subcategory;
            }
        });

        // Setup a property to get subscribers
        Object.defineProperty(msgObj, "subscribers", {
            get: function() {
                return messageIndex.query(msg).length;
            }
        });

        // If debug mode is enabled then let's expose the internal method hit counts.
        // These counts are only good if a method is called and succeeds.
        if (external.debug === true) {
            Object.defineProperty(msgObj, "counts", {
                get: function() {
                    return counts;
                }
            });
        }

        return msgObj;
    };

    // This is an internal extension; do not export explicitly.
    return {};
}));
