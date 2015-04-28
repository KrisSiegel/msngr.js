/*
    ./objects/message.js

    The primary object of msngr; handles all message sending, receiving and binding.
*/
msngr.extend((function (external, internal) {
    "use strict";

    internal.objects = internal.objects || { };

    var handlers = { };
    var handlerCount = 0;

    Object.defineProperty(external, "handlerCount", {
        get: function () {
            return handlerCount;
        }
    });

    internal.reset = function () {
        handlers = { };
        handlerCount = 0;
        internal.store.clear();
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

        var msgObj =  {
            emit: function (payload, callback) {
                var uuids = internal.store.query(msg);
                if (uuids.length > 0) {
                    var methods = [];
                    for (var i = 0; i < uuids.length; ++i) {
                        var obj = handlers[uuids[i]];
                        methods.push(obj.handler);
                    }
                    var execs = internal.objects.executer(methods, payload, (msg.context || this));

                    execs.parallel(callback);
                }

                return msgObj;
            },
            persist: function (payload) {

            },
            on: function (handler) {
                var uuid = internal.store.index(msg);
                handlers[uuid] = {
                    handler: handler,
                    context: (msg.context || this)
                };
                handlerCount++;

                return msgObj;
            },
            bind: function (element, event) {

            },
            drop: function (handler) {
                var uuids = internal.store.query(msg);
                if (uuids.length > 0) {
                    for (var i = 0; i < uuids.length; ++i) {
                        var uuid = uuids[i];
                        if (handlers[uuid].handler === handler) {
                            delete handlers[uuid];
                            handlerCount--;

                            internal.store.delete(uuid);
                        }
                    }
                }

                return msgObj;
            },
            unbind: function (element, event) {

            },
            dropAll: function () {
                var uuids = internal.store.query(msg);
                if (uuids.length > 0) {
                    for (var i = 0; i < uuids.length; ++i) {
                        var uuid = uuids[i];
                        delete handlers[uuid];
                        handlerCount--;

                        internal.store.delete(uuid);
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
