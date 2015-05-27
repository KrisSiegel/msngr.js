/*
    ./objects/message.js

    The primary object of msngr; handles all message sending, receiving and binding.
*/
msngr.extend((function (external, internal) {
    "use strict";

    internal.objects = internal.objects || { };

    var messageIndex = internal.objects.memory();
    var payloadIndex = internal.objects.memory();

    var handlers = { };
    var handlerCount = 0;

    var payloads = { };
    var payloadCount = 0;

    var boundDOMPaths = { };
    var boundCount = 0;

    Object.defineProperty(internal, "handlerCount", {
        get: function () {
            return handlerCount;
        }
    });

    Object.defineProperty(internal, "boundCount", {
        get: function () {
            return boundCount;
        }
    });

    Object.defineProperty(internal, "payloadCount", {
        get: function () {
            return payloadCount;
        }
    });

    internal.reset = function () {
        handlers = { };
        boundDOMPaths = { };
        handlerCount = 0;
        boundCount = 0;
        messageIndex.clear();
        payloadIndex.clear();
        payloads = { };
        payloadCount = 0;
    };

    internal.processOpts = function (opts, message, payload, callback) {
        payload = payload || { };
        var optProcessors = [];
        for (var key in opts) {
            if (opts.hasOwnProperty(key) && external.exist(internal.options[key])) {
                optProcessors.push(internal.options[key]);
            }
        }

        // Short circuit for no options
        if (optProcessors.length === 0) {
            return callback.apply(this, [payload]);
        }

        // Long circuit to do stuff (du'h)
        var execs = internal.objects.executer(optProcessors, [message, payload, opts], this);

        execs.parallel(function (results) {
            var result = payload;
            if (external.exist(results) && results.length > 0) {
                for (var i = 0; i < results.length; ++i) {
                    if (external.exist(results[i])) {
                        result = external.extend(results[i], result);
                    }
                }
            }
            callback.apply(this, [result]);
        });
    };

    internal.domListener = function (event) {
        var node = this;
        var path = external.getDomPath(node);

        if (external.exist(boundDOMPaths[path])) {
            if (external.exist(boundDOMPaths[path][event.type])) {
                return boundDOMPaths[path][event.type].emit();
            }
        }
    };

    internal.objects.message = function (topic, category, dataType) {
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
            msg = topic;
        } else {
            msg = { };
            msg.topic = topic;

            if (!external.isEmptyString(category)) {
                msg.category = category;
            }

            if (!external.isEmptyString(dataType)) {
                msg.dataType = dataType;
            }
        }

        var options = { };

        var counts = {
            emits: 0,
            persists: 0,
            options: 0,
            ons: 0,
            onces: 0,
            binds: 0
        };

        var explicitEmit = function (payload, uuids, callback) {
            var uuids = uuids || messageIndex.query(msg);
            if (uuids.length > 0) {
                var methods = [];
                var toDrop = [];
                for (var i = 0; i < uuids.length; ++i) {
                    var obj = handlers[uuids[i]];
                    methods.push(obj.handler);

                    if (obj.once === true) {
                        toDrop.push(obj.handler);
                    }
                }

                internal.processOpts(options, msg, payload, function (result) {
                    var execs = internal.objects.executer(methods, result, (msg.context || this));

                    for (var i = 0; i < toDrop.length; ++i) {
                        msgObj.drop(toDrop[i]);
                    }

                    execs.parallel(callback);

                });
            }
        };

        var fetchPersisted = function () {
            var uuids = payloadIndex.query(msg);

            var fpay;

            if (uuids.length === 0) {
                return undefined;
            }

            if (uuids.length === 1) {
                return payloads[uuids[0]];
            }

            for (var i = 0; i < uuids.length; ++i) {
                fpay = external.extend(innerPay, fpay);
            }

            return fpay;
        };

        var msgObj =  {
            option: function (key, value) {
                options[key] = value;
                counts.options = counts.options + 1;

                return msgObj;
            },
            emit: function (payload, callback) {
                if (external.isFunction(payload)) {
                    callback = payload;
                    payload = undefined;
                }
                explicitEmit(payload, undefined, callback);
                counts.emits = counts.emits + 1;

                return msgObj;
            },
            persist: function (payload) {
                if (payload === undefined) {
                    payload = null;
                }

                var uuids = payloadIndex.query(msg);
                if (uuids.length === 0) {
                    var uuid = payloadIndex.index(msg);
                    payloads[uuid] = payload;
                    uuids = [uuid];
                } else {
                    for (var i = 0; i < uuids.length; ++i) {
                        payloads[uuids[i]] = external.extend(payload, payloads[uuids[i]]);
                    }
                }

                var fpay = fetchPersisted();

                ++payloadCount;

                counts.persists = counts.persists + 1;

                return msgObj.emit(fpay);
            },
            cease: function () {
                var uuids = payloadIndex.query(msg);

                for (var i = 0; i < uuids.length; ++i) {
                    delete payloads[uuids[i]];
                    --payloadCount;
                }

                return msgObj;
            },
            on: function (handler) {
                var uuid = messageIndex.index(msg);
                handlers[uuid] = {
                    handler: handler,
                    context: (msg.context || this),
                    once: false
                };
                handlerCount++;

                var payload = fetchPersisted();
                if (payload !== undefined) {
                    explicitEmit(payload, [uuid], undefined);
                }
                counts.ons = counts.ons + 1;

                return msgObj;
            },
            once: function (handler) {
                var uuid = messageIndex.index(msg);
                handlers[uuid] = {
                    handler: handler,
                    context: (msg.context || this),
                    once: true
                };
                handlerCount++;

                var payload = fetchPersisted();
                if (payload !== undefined) {
                    explicitEmit(payload, [uuid], undefined);
                }
                counts.onces = counts.onces + 1;

                return msgObj;
            },
            bind: function (element, event) {
                var node = external.findElement(element);
                var path = external.getDomPath(node);

                if (!external.exist(boundDOMPaths[path])) {
                    boundDOMPaths[path] = { };
                }

                boundDOMPaths[path][event] = msgObj;

                node.addEventListener(event, internal.domListener);

                ++boundCount;
                counts.binds = counts.binds + 1;

                return msgObj;
            },
            drop: function (handler) {
                var uuids = messageIndex.query(msg);
                if (uuids.length > 0) {
                    for (var i = 0; i < uuids.length; ++i) {
                        var uuid = uuids[i];
                        if (handlers[uuid].handler === handler) {
                            delete handlers[uuid];
                            handlerCount--;

                            messageIndex.delete(uuid);
                        }
                    }
                }

                return msgObj;
            },
            unbind: function (element, event) {
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
            dropAll: function () {
                var uuids = messageIndex.query(msg);
                if (uuids.length > 0) {
                    for (var i = 0; i < uuids.length; ++i) {
                        var uuid = uuids[i];
                        delete handlers[uuid];
                        handlerCount--;

                        messageIndex.delete(uuid);
                    }
                }

                return msgObj;
            }
        };

        // Expose the raw message object itself via a message property.
        // Do not allow modification.
        Object.defineProperty(msgObj, "message", {
    		get: function () {
    			return msg;
    		}
    	});

        // If debug mode is enabled then let's expose the internal method hit counts.
        // These counts are only good if a method is called and succeeds.
        if (external.debug === true) {
            Object.defineProperty(msgObj, "counts", {
                get: function () {
                    return counts;
                }
            });
        }

        return msgObj;
    };

    // This is an internal extension; do not export explicitly.
    return { };
}));
