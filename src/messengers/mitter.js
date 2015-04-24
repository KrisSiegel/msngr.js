msngr.extend((function () {
    "use strict";

    // Throw statements
    var InvalidParameters = function (str) {
        return {
            severity: "unrecoverable",
            message: ("Invalid parameters supplied to the {method} method".replace("{method}", str))
        };
    };

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
        var uuids = msngr.store.query(message);
        if (uuids.length > 0) {
            for (var i = 0; i < uuids.length; ++i) {
                var del = delegates[uuids[i]];
                var params = [];
                if (msngr.utils.exist(payload || message.payload)) {
                    params.push(payload || message.payload);
                }
                execute(del.callback, del.context, params, message);
            }
        }

        return msngr;
    };

    var _on = function (message, callback) {
        var uuid = msngr.store.index(message);
        delegates[uuid] = {
            callback: callback,
            context: (message.context || this),
            onedMessage: message
        };
        delegateCount++;

        return msngr;
    };

    var _drop = function (message, func) {
        var uuids = msngr.store.query(message);
        if (uuids.length > 0) {
            for (var i = 0; i < uuids.length; ++i) {
                var uuid = uuids[i];
                if (msngr.utils.exist(func)) {
                    if (delegates[uuid].callback === func) {
                        delete delegates[uuid];
                        delegateCount--;

                        msngr.store.delete(uuid);
                    }
                } else {
                    delete delegates[uuid];
                    delegateCount--;

                    msngr.store.delete(uuid);
                }
            }
        }

        return msngr;
    };

    return {
        emit: function (topic, category, dataType, payload, callback) {
            if (!msngr.utils.exist(topic)) {
                throw InvalidParameters("emit");
            }

            var message;
            if (msngr.utils.isObject(topic)) {
                message = topic;
                if (!msngr.utils.exist(payload) && msngr.utils.exist(category)) {
                    payload = category;
                }
                if (!msngr.utils.exist(callback) && msngr.utils.exist(dataType) && msngr.utils.isFunction(dataType)) {
                    callback = dataType;
                }
                return _emit(message, payload, callback);
            }

            message = { };
            var args = msngr.utils.argumentsToArray(arguments);

            message.topic = args.shift();

            if (!msngr.utils.exist(payload)) {
                if (args.length > 0 && msngr.utils.isObject(args[0])) {
                    payload = args.shift();

                    return _emit(message, payload);
                }
            }

            message.category = args.shift();

            if (args.length > 0 && msngr.utils.isObject(args[0])) {
                payload = args.shift();

                return _emit(message, payload);
            }
            message.dataType = args.shift();

            return _emit(message, payload);
        },
        on: function (topic, category, dataType, callback) {
            if (!msngr.utils.exist(topic)) {
                throw InvalidParameters("on");
            }

            var message;
            if (msngr.utils.isObject(topic)) {
                message = topic;
                if (!msngr.utils.exist(callback) && msngr.utils.exist(category)) {
                    callback = category;
                }
                return _on(message, callback);
            }
            if (arguments.length > 1) {
                message = { };
                var args = msngr.utils.argumentsToArray(arguments);

                message.topic = args.shift();

                message.category = args.shift();
                message.dataType = args.shift();

                callback = callback || args.pop();

                if (msngr.utils.isFunction(message.category) && !msngr.utils.exist(message.dataType)) {
                    callback = message.category;
                    delete message.category;
                    delete message.dataType;
                }

                if (msngr.utils.isFunction(message.dataType) && msngr.utils.exist(message.category)) {
                    callback = message.dataType;
                    delete message.dataType;
                }

                return _on(message, callback);
            }

            throw InvalidParameters("on");
        },
        drop: function (topic, category, dataType, callback) {
            if (!msngr.utils.exist(topic)) {
                throw InvalidParameters("drop");
            }

            var message;
            if (msngr.utils.isObject(topic)) {
                message = topic;
                if (!msngr.utils.exist(callback) && msngr.utils.exist(category)) {
                    callback = category;
                }
                return _drop(message, callback);
            }
            if (arguments.length > 0) {
                message = { };
                var args = msngr.utils.argumentsToArray(arguments);

                message.topic = args.shift();

                message.category = args.shift();
                message.dataType = args.shift();

                callback = callback || args.pop();

                if (msngr.utils.isFunction(message.category) && !msngr.utils.exist(message.dataType)) {
                    callback = message.category;
                    delete message.category;
                    delete message.dataType;
                }

                if (msngr.utils.isFunction(message.dataType) && msngr.utils.exist(message.category)) {
                    callback = message.dataType;
                    delete message.dataType;
                }

                return _drop(message, callback);
            }

            throw InvalidParameters("drop");
        },
        dropAll: function () {
            delegates = { };
            delegateCount = 0;
            msngr.store.clear();

            return msngr;
        },
        getMessageCount: function () {
            return delegateCount;
        }
    };
}()));
