/*
    ./messaging/message.js

    The primary object of msngr; handles all message sending, receiving and binding.
*/
msngr.extend(function (external, internal) {
    "use strict";

    // Memory indexers for messages and payloads
    var messageIndex = internal.memory();
    var payloadIndex = internal.memory();

    // Holds handlers
    var handlers = {};
    var handlerCount = 0;

    // Holds payloads for persist
    var payloads = {};
    var payloadCount = 0;

    // Holds middlewares
    var middlewares = { };
    var forced = [];

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

        middlewares = { };
        forced = [];
    };

    /*
        Private APIs
    */
    var fetchPersistedPayload = function (msg) {
        var ids = payloadIndex.query(msg);

        if (ids.length === 0) {
            return;
        }

        var payload = payloads[ids[0]];

        if (ids.length > 1) {
            for (var i = 1; i < ids.length; ++i) {
                payload = external.merge(innerPay, fpay);
            }
        }

        return payload;
    };

    // gets a listing of middlewares
    var getMiddlewares = function (uses, payload, message) {
        var results = [];
        var keys = (uses || []);
        for (var i = 0; i < forced.length; ++i) {
            if (keys.indexOf(forced[i]) === -1) {
                keys.push(forced[i]);
            }
        }

        for (var i = 0; i < keys.length; ++i) {
            if (middlewares[keys[i]] !== undefined) {
                results.push({
                    method: middlewares[keys[i]],
                    params: [payload, message]
                });
            }
        }

        return results;
    };

    internal.getMiddlewares = getMiddlewares; // Expose method to the internal API for testing

    // Executes middlewares
    var executeMiddlewares = function (uses, payload, message, callback) {
        var middles = getMiddlewares(uses, payload, message);
        internal.executer(middles).series(function (result) {
            return callback(internal.merge.apply(this, [payload].concat(result)));
        });
    };

    // Settles middlewares
    var settleMiddleware = function (uses, payload, message, callback) {
        executeMiddlewares(uses, payload, message, function (newPayload) {
            callback.apply(undefined, [newPayload]);
        });
    };

    // An explicit emit
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
            throw new Error("msngr() - Invalid parameters");
        }

        if (!isTopic.object && !isTopic.string) {
            throw new Error("msngr() - Invalid parameters");
        }

        if (isTopic.empty) {
            throw new Error("msngr() - Invalid parameters");
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
                if (external.is(middleware).string) {
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

                if (uses.length > 0 || forced.length > 0) {
                    settleMiddleware(uses, payload, msg, function (newPayload) {
                        explicitEmit(msg, newPayload, callback);
                    });
                } else {
                    explicitEmit(msg, payload, callback);
                }
                

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
                    if (uses.length > 0 || forced.length > 0) {
                        settleMiddleware(uses, payload, msg, function (newPayload) {
                            explicitEmit([id], newPayload);
                        });
                    } else {
                        explicitEmit([id], payload);
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
                    if (uses.length > 0 || forced.length > 0) {
                        settleMiddleware(uses, payload, msg, function (newPayload) {
                            explicitEmit([id], newPayload);
                        });
                    } else {
                        explicitEmit([id], payload);
                    }
                }

                return msgObj;
            },
            drop: function(handler) {
                var ids = messageIndex.query(msg);
                if (ids.length > 0) {
                    for (var i = 0; i < ids.length; ++i) {
                        if (handlers[ids[i]].handler === handler) {
                            delete handlers[ids[i]];
                            handlerCount--;

                            messageIndex.delete(ids[i]);
                        }
                    }
                }

                return msgObj;
            },
            dropAll: function() {
                var ids = messageIndex.query(msg);
                if (ids.length > 0) {
                    for (var i = 0; i < ids.length; ++i) {
                        delete handlers[ids[i]];
                        handlerCount--;

                        messageIndex.delete(ids[i]);
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

    /*
        msngr.middleware(key, fn, force) provides a way to execute code during each message delegation

        key -> identifier for the middleware (think unique name or id).
        fn -> the function to execute for the middleware.
        force (optional) -> a boolean to force whether the middleware is always executed or only when explicitly specified.
    */
    external.middleware = function (key, fn, force) {
        var isKey = external.is(key);
        var isFn = external.is(fn);
        if (!isKey.there || !isKey.string || isKey.empty || !isFn.there || !isFn.function) {
            throw new Error("msngr.middleware() - Invalid parameters");
        }

        if (external.is(middlewares[key]).there) {
            throw new Error("msngr.middleware() - Invalid parameters");
        }

        var normalizedKey = key.toLowerCase();
        middlewares[normalizedKey] = fn;
        if (force === true) {
            forced.push(normalizedKey);
        }
    };

    /*
        msngr.unmiddleware(key) removes a middleware

        key -> identifier for the middleware to remove.
    */
    external.unmiddleware = function (key) {
        var isKey = external.is(key);
        if (!isKey.there || !isKey.string || isKey.empty) {
            throw new Error("msngr.unmiddleware() - Invalid parameters");
        }

        var normalizedKey = key.toLowerCase();
        var forcedInx = forced.indexOf(normalizedKey);
        if (forcedInx !== -1) {
            forced.splice(forcedInx, 1);
        }

        if (middlewares[normalizedKey] !== undefined) {
            delete middlewares[normalizedKey];
        }
    };
});
