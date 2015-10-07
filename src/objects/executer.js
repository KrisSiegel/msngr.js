msngr.extend((function(external, internal) {
    "use strict";

    internal.objects = internal.objects || {};
    internal.objects.executer = function(methods, payload, context) {

        if (external.isFunction(methods)) {
            methods = [methods];
        }

        if (!external.exist(methods) || !external.isArray(methods)) {
            throw internal.InvalidParametersException("executor");
        }

        var exec = function(method, pay, ctx, done) {
            setTimeout(function() {
                var async = false;
                var asyncFunc = function() {
                    async = true;
                    return function(result) {
                        done.apply(ctx, [result]);
                    };
                }

                var params = undefined;
                if (external.isArray(pay)) {
                    params = pay;
                } else {
                    params = [pay];
                }
                params.push(asyncFunc);

                var syncResult = method.apply(ctx || this, params);
                if (async !== true) {
                    done.apply(ctx, [syncResult]);
                }
            }, 0);
        };

        return {
            execute: function(done) {
                if (methods.length === 0 && external.exist(done)) {
                    return done.apply(context, [
                        []
                    ]);
                }
                return exec(methods[0], payload, context, done);
            },
            parallel: function(done) {
                var results = [];
                var executed = 0;

                if (methods.length === 0 && external.exist(done)) {
                    return done.apply(context, [
                        []
                    ]);
                }

                for (var i = 0; i < methods.length; ++i) {
                    (function(m, p, c) {
                        exec(m, p, c, function(result) {
                            if (external.exist(result)) {
                                results.push(result);
                            }

                            ++executed;

                            if (executed === methods.length && external.exist(done)) {
                                done.apply(context, [results]);
                            }
                        });
                    }(methods[i], payload, context));
                }
            }
        };
    };

    // This is an internal extension; do not export explicitly.
    return {
        executer: internal.objects.executer
    };
}));
