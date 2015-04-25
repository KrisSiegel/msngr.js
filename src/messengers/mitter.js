msngr.extend((function (external, internal) {
    "use strict";

    var delegates = { };
    var delegateCount = 0;

    var executeSync = function (method, context, params, message) {
        (function (m, c, p, msg) {
            var cont = true;
            var wrap = {
                preventDefault: function () {
                    cont = false;
                },
                payload: p[0],
                done: function () {
                    if (cont === true) {
                        m.apply(c, [wrap.payload]);
                    }
                }
            };
            msngr.act(msg, wrap);
        }(method, context, params, message));
    };

    var execute = function (method, context, params, message) {
        (function (m, c, p, msg) {
            setTimeout(function () {
                executeSync(m, c, p, msg);
            }, 0);
        }(method, context, params, message));
    };

    var _emit = function (message, payload, callback) {
        var uuids = internal.store.query(message);
        if (uuids.length > 0) {
            for (var i = 0; i < uuids.length; ++i) {
                var del = delegates[uuids[i]];
                var params = [];
                if (external.exist(payload || message.payload)) {
                    params.push(payload || message.payload);
                }
                execute(del.callback, del.context, params, message);
            }
        }

        return msngr;
    };

    var _on = function (message, callback) {
        var uuid = internal.store.index(message);
        delegates[uuid] = {
            callback: callback,
            context: (message.context || this),
            onedMessage: message
        };
        delegateCount++;

        return msngr;
    };

    var _drop = function (message, func) {
        var uuids = internal.store.query(message);
        if (uuids.length > 0) {
            for (var i = 0; i < uuids.length; ++i) {
                var uuid = uuids[i];
                if (external.exist(func)) {
                    if (delegates[uuid].callback === func) {
                        delete delegates[uuid];
                        delegateCount--;

                        internal.store.delete(uuid);
                    }
                } else {
                    delete delegates[uuid];
                    delegateCount--;

                    internal.store.delete(uuid);
                }
            }
        }

        return msngr;
    };

    return {
        msg: function (topic, category, dataType) {
            if (!external.exist(topic)) {
                throw internal.InvalidParametersException("topic");
            }

            var message;
            if (external.isObject(topic)) {
                message = topic;
            } else {
                message = {
                    topic: topic,
                    category: category,
                    dataType: dataType
                };
            }

            return {
                emit: function (payload) {

                },
                on: function (callback) {

                },
                drop: function (callback) {

                },
                dropAll: function () {

                }
            };
        },
        emit: function (topic, category, dataType, payload, callback) {
            if (!external.exist(topic)) {
                throw internal.InvalidParametersException("emit");
            }

            var message;
            if (external.isObject(topic)) {
                message = topic;
                if (!external.exist(payload) && external.exist(category)) {
                    payload = category;
                }
                if (!external.exist(callback) && external.exist(dataType) && external.isFunction(dataType)) {
                    callback = dataType;
                }
                return _emit(message, payload, callback);
            }

            message = { };
            var args = external.argumentsToArray(arguments);

            message.topic = args.shift();

            if (!external.exist(payload)) {
                if (args.length > 0 && external.isObject(args[0])) {
                    payload = args.shift();

                    return _emit(message, payload);
                }
            }

            message.category = args.shift();

            if (args.length > 0 && external.isObject(args[0])) {
                payload = args.shift();

                return _emit(message, payload);
            }
            message.dataType = args.shift();

            return _emit(message, payload);
        },
        on: function (topic, category, dataType, callback) {
            if (!external.exist(topic)) {
                throw internal.InvalidParametersException("on");
            }

            var message;
            if (external.isObject(topic)) {
                message = topic;
                if (!external.exist(callback) && external.exist(category)) {
                    callback = category;
                }
                return _on(message, callback);
            }
            if (arguments.length > 1) {
                message = { };
                var args = external.argumentsToArray(arguments);

                message.topic = args.shift();

                message.category = args.shift();
                message.dataType = args.shift();

                callback = callback || args.pop();

                if (external.isFunction(message.category) && !external.exist(message.dataType)) {
                    callback = message.category;
                    delete message.category;
                    delete message.dataType;
                }

                if (external.isFunction(message.dataType) && external.exist(message.category)) {
                    callback = message.dataType;
                    delete message.dataType;
                }

                return _on(message, callback);
            }

            throw internal.InvalidParametersException("on");
        },
        drop: function (topic, category, dataType, callback) {
            if (!external.exist(topic)) {
                throw internal.InvalidParametersException("drop");
            }

            var message;
            if (external.isObject(topic)) {
                message = topic;
                if (!external.exist(callback) && external.exist(category)) {
                    callback = category;
                }
                return _drop(message, callback);
            }
            if (arguments.length > 0) {
                message = { };
                var args = external.argumentsToArray(arguments);

                message.topic = args.shift();

                message.category = args.shift();
                message.dataType = args.shift();

                callback = callback || args.pop();

                if (external.isFunction(message.category) && !external.exist(message.dataType)) {
                    callback = message.category;
                    delete message.category;
                    delete message.dataType;
                }

                if (external.isFunction(message.dataType) && external.exist(message.category)) {
                    callback = message.dataType;
                    delete message.dataType;
                }

                return _drop(message, callback);
            }

            throw internal.InvalidParametersException("drop");
        },
        dropAll: function () {
            delegates = { };
            delegateCount = 0;
            internal.store.clear();

            return msngr;
        },
        getMessageCount: function () {
            return delegateCount;
        }
    };
}));
