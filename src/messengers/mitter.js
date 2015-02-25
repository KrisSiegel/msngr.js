msngr.extend((function () {
    "use strict";

    var delegates = { };
    var delegateCount = 0;

    var executeSync = function (method, context, params) {
        method.apply(context, params);
    };

    var execute = function (method, context, params) {
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
                    execute(del.callback, del.context, [payload || message.payload]);
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
