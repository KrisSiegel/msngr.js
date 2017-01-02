/*
    ./src/messaging/middleware.js

    Supports executing middleware during message delegation
*/

msngr.extend((function (external, internal) {
    "use strict";

    var middlewares = { };
    var forced = [];

    /*
        Internal APIs
    */
    internal.getMiddlewares = function (uses, payload, message) {
        var results = [];
        var keys = (uses || []).concat(forced);
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

    internal.executeMiddlewares = function (uses, payload, message, callback) {
        var middles = internal.getMiddlewares(uses, payload, message);

        var execute = internal.executer(middles).series(function (result) {
            return callback(internal.merge.apply(this, [payload].concat(result)));
        });
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
            throw internal.InvalidParametersException("msngr.middleware()");
        }

        if (external.is(middlewares[key]).there) {
            throw internal.DuplicateException("msngr.middleware()");
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
            throw internal.InvalidParametersException("msngr.unmiddleware()");
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

}));
