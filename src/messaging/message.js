/*
    ./messaging/message.js

    The primary object of msngr; handles all message sending, receiving and binding.
*/
msngr.extend((function (external, internal) {
    "use strict";

    var messageIndex = internal.memory();
    var payloadIndex = internal.memory();

    var handlers = {};
    var handlerCount = 0;

    var payloads = {};
    var payloadCount = 0;

    /*
        Internal APIs
    */
    Object.defineProperty(internal, "handlerCount", {
        get: function() {
            return handlerCount;
        }
    });

    Object.defineProperty(internal, "payloadCount", {
        get: function() {
            return payloadCount;
        }
    });

    internal.reset = function() {
        handlers = {};
        handlerCount = 0;
        messageIndex.clear();
        payloadIndex.clear();
        payloads = {};
        payloadCount = 0;
        internal.resetMiddlewares();
    };

    /*
        Private APIs
    */
    var fetchPersistedPayload = function (msg) {
        var ids = payloadIndex.query(msg);

        if (ids.length === 0) {
            return undefined;
        }

        var payload = payloads[ids[0]];

        if (ids.length > 1) {
            for (var i = 1; i < ids.length; ++i) {
                payload = external.merge(innerPay, fpay);
            }
        }

        return payload;
    };

    var settleMiddleware = function (uses, payload, message, callback) {
        internal.executeMiddlewares(uses, payload, message, function (newPayload) {
            callback.apply(undefined, [newPayload]);
        });
    };

    var explicitEmit = function (msgOrIds, payload, callback) {
        var ids = (external.is(msgOrIds).array) ? msgOrIds : messageIndex.query(msgOrIds);

        if (ids.length > 0) {
            var methods = [];
            var toDrop = [];
            for (var i = 0; i < ids.length; ++i) {
                var msg = (external.is(msgOrIds).object) ? external.copy(msgOrIds) : external.copy(messageIndex.query(ids[i]));
                var obj = handlers[ids[i]];
                methods.push({
                    method: obj.handler,
                    params: [payload, msg]
                });

                if (obj.once === true) {
                    toDrop.push({
                        msg: msg,
                        handler: obj.handler
                    });
                }
            }

            var execs = internal.executer(methods);

            for (var i = 0; i < toDrop.length; ++i) {
                external(toDrop[i].msg).drop(toDrop[i].handler);
            }

            execs.parallel(callback);
        }
    };

    /*
        msngr() / msngr.message() returns a set of chainable methods for handling messaging
    */
    external.message = function (topic, category, subcategory) {
        var isTopic = external.is(topic);
        var isCategory = external.is(category);
        var isSubcategory = external.is(subcategory);
        if (!isTopic.there) {
            throw internal.InvalidParametersException("msngr()");
        }

        if (!isTopic.object && !isTopic.string) {
            throw internal.InvalidParametersException("msngr()");
        }

        if (isTopic.empty) {
            throw internal.InvalidParametersException("msngr()");
        }

        var msg;
        if (isTopic.object) {
            msg = external.copy(topic);
        } else {
            msg = {};
            msg.topic = topic;

            if (!isCategory.empty && isCategory.string) {
                msg.category = category;
            }

            if (!isSubcategory.empty && isSubcategory.string) {
                msg.subcategory = subcategory;
            }
        }

        // Normalize message to lowercase
        for (var prop in msg) {
            if (msg.hasOwnProperty(prop)) {
                msg[prop] = msg[prop].toLowerCase();
            }
        }

        var uses = [];

        var msgObj = {
            use: function (middleware) {
                if (!external.is(middleware).empty) {
                    var normalizedKey = middleware.toLowerCase();
                    uses.indexOf(normalizedKey) === -1 && uses.push(middleware.toLowerCase());
                }

                return msgObj;
            },
            emit: function (payload, callback) {
                var isPayload = external.is(payload);
                if (isPayload.function) {
                    callback = payload;
                    payload = undefined;
                }

                settleMiddleware(uses, payload, msg, function (newPayload) {
                    explicitEmit(msg, newPayload, callback);
                });

                return msgObj;
            },
            persist: function (payload) {
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
                ++payloadCount;

                return msgObj.emit(fetchPersistedPayload(msg));
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

                var payload = fetchPersistedPayload(msg);
                if (payload !== undefined) {
                    if (uses.length > 0) {
                        settleMiddleware(uses, payload, msg, function (newPayload) {
                            explicitEmit([id], newPayload, undefined);
                        });
                    } else {
                        explicitEmit([id], payload, undefined);
                    }
                }

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

                var payload = fetchPersistedPayload(msg);
                if (payload !== undefined) {
                    if (uses.length > 0) {
                        settleMiddleware(uses, payload, msg, function (newPayload) {
                            explicitEmit([id], newPayload, undefined);
                        });
                    } else {
                        explicitEmit([id], payload, undefined);
                    }
                }

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

        // Setup a property to get the handlers count
        Object.defineProperty(msgObj, "handlers", {
            get: function() {
                return messageIndex.query(msg).length;
            }
        });

        return msgObj;
    };
}));
