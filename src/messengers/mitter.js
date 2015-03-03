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

    var _emit = function (message, payload) {
        var uuids = msngr.store.query(message);
        if (uuids.length > 0) {
            for (var i = 0; i < uuids.length; ++i) {
                var del = delegates[uuids[i]];
                var params = [];
                if (msngr.utils.exists(payload || message.payload)) {
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

    var _drop = function (message) {
        var uuids = msngr.store.query(message);
        if (uuids.length > 0) {
            for (var i = 0; i < uuids.length; ++i) {
                var uuid = uuids[i];
                delete delegates[uuid];
                delegateCount--;

                msngr.store.delete(uuid);
            }
        }

        return msngr;
    };

    return {
        emit: function (topic, category, dataType, payload) {
            if (!msngr.utils.exists(topic)) {
                throw InvalidParameters("emit");
            }

            var message;
            if (msngr.utils.isObject(topic)) {
                message = topic;
                if (!msngr.utils.exists(payload) && msngr.utils.exists(category)) {
                    payload = category;
                }
                return _emit(message, payload);
            }
            if (arguments.length > 1) {
                message = { };
                var args = msngr.utils.argumentsToArray(arguments);

                message.topic = args.shift();

                if (!msngr.utils.exists(payload)) {
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
            }

            throw InvalidParameters("emit");
        },
        on: function (topic, category, dataType, callback) {
            if (!msngr.utils.exists(topic)) {
                throw InvalidParameters("on");
            }

            var message;
            if (msngr.utils.isObject(topic)) {
                message = topic;
                if (!msngr.utils.exists(callback) && msngr.utils.exists(category)) {
                    callback = category;
                }
                return _on(message, callback);
            }
            if (arguments.length > 1) {
                message = { };
                var args = msngr.utils.argumentsToArray(arguments);

                callback = callback || args.pop();

                message.topic = args.shift();

                message.category = args.shift();
                message.dataType = args.shift();

                return _on(message, callback);
            }

            throw InvalidParameters("on");
        },
        drop: function (topic, category, dataType) {
            if (!msngr.utils.exists(topic)) {
                throw InvalidParameters("drop");
            }

            var message;
            if (msngr.utils.isObject(topic)) {
                message = topic;
                return _drop(message);
            } else {
                message = { };
                if (msngr.utils.exists(topic)) {
                    message.topic = topic;
                }

                if (msngr.utils.exists(category)) {
                    message.category = category;
                }

                if (msngr.utils.exists(dataType)) {
                    message.dataType = dataType;
                }
                return _drop(message);
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
