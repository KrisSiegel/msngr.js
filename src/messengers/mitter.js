msngr.extend((function () {
    "use strict";

    var delegates = { };
    var delegateCount = 0;

    var handlers = { };

    var executeSync = function (method, context, params, message) {
        /*
        for (var key in message) {
            if (message.hasOwnProperty(key) && ["topic", "category", "dataType"].indexOf(key) === -1) {
                if (msngr.utils.exists(handlers[key]) && msngr.utils.exists(handlers[key]["before"])) {
                    var cont = true;
                    handlers[key]["before"]({

                    });
                }
            }
        }*/
        method.apply(context, params);
    };

    var execute = function (method, context, params, message) {
        (function (m, c, p) {
            setTimeout(function () {
                executeSync(m, c, p);
            }, 0);
        }(method, context, params));
    };

    return {
        emit: function (message, payload) {
            var uuids = msngr.stores.memory.query(message);
            if (uuids.length > 0) {
                for (var i = 0; i < uuids.length; ++i) {
                    var del = delegates[uuids[i]];
                    execute(del.callback, del.context, [payload || message.payload], message);
                }
            }

            return msngr;
        },
        register: function (message, callback) {
            var uuid = msngr.stores.memory.index(message);
            delegates[uuid] = {
                callback: callback,
                context: (message.context || this),
                registeredMessage: message
            };
            delegateCount++;

            return msngr;
        },
        unregister: function (message) {
            var uuids = msngr.stores.memory.query(message);
            if (uuids.length > 0) {
                for (var i = 0; i < uuids.length; ++i) {
                    var uuid = uuids[i];
                    delete delegates[uuid];
                    delegateCount--;

                    msngr.stores.memory.delete(uuid);
                }
            }

            return msngr;
        },
        handle: function (property, when, handler) {
            if (msngr.utils.exists(property)) {
                if (msngr.utils.isFunction(when) && !msngr.utils.exists(handler)) {
                    handler = when;
                    when = "before";
                }

                if (msngr.utils.exists(when) && msngr.utils.exists(handler)) {
                    handlers[property][when] = handler;
                }
            }

            return msngr;
        },
        unhandle: function (property, when) {
            if (msngr.utils.exists(property)) {
                if (!msngr.utils.exists(when)) {
                    delete handlers[property];
                } else {
                    delete handlers[property][when];
                }
            }

            return msngr;
        },
        unregisterAll: function () {
            delegates = { };
            delegateCount = 0;
            msngr.stores.memory.clear();

            return msngr;
        },
        getDelegateCount: function () {
            return delegateCount;
        }
    };
}()));
