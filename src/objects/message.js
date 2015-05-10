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
                    result = external.extend(results[i], result);
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

        var msgObj =  {
            option: function (key, value) {
                options[key] = value;

                return msgObj;
            },
            emit: function (payload, callback) {
                explicitEmit(payload, undefined, callback);

                return msgObj;
            },
            persist: function (payload) {
                var uuids = payloadIndex.query(msg);
                var uuid;
                if (uuids.length > 0) {
                    uuid = uuids[0];
                } else {
                    uuid = payloadIndex.index(msg);
                }

                payloads[uuid] = payload;
                ++payloadCount;

                return msgObj.emit(payload);
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

                var payloadId = payloadIndex.query(msg);
                var payload = payloads[payloadId];
                if (external.exist(payload)) {
                    explicitEmit(payload, [uuid], undefined);
                }

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

        Object.defineProperty(msgObj, "message", {
    		get: function () {
    			return msg;
    		}
    	});

        return msgObj;
    };

    // This is an internal extension; do not export explicitly.
    return { };
}));
