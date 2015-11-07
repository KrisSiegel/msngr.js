msngr.extend((function(external, internal) {
    "use strict";

    internal.objects = internal.objects || {};
    internal.objects.executer = function(methods) {

        if (!external.exist(methods) || !external.isArray(methods)) {
            throw internal.InvalidParametersException("executor");
        }

        // Support passing in just methods
        for (var i = 0; i < methods.length; ++i) {
            if (external.isFunction(methods[i])) {
                methods[i] = {
                    method: methods[i]
                };
            }
        }

        var exec = function(method, params, ctx, done) {
            setTimeout(function() {
                var asyncFlag = false;
                var asyncFunc = function() {
                    asyncFlag = true;
                    return function(result) {
                        done.apply(ctx, [result]);
                    };
                }

                if (!external.isArray(params)) {
                    if (external.exist(params)) {
                        params = [params];
                    } else {
                        params = [];
                    }
                }
                params.push(asyncFunc);
                var syncResult = method.apply(ctx || this, params);
                if (asyncFlag !== true) {
                    done.apply(ctx, [syncResult]);
                }
            }, 0);
        };

        return {
            parallel: function(done) {
                var results = [];
                var executed = 0;

                if (methods.length === 0 && external.exist(done)) {
                    return done.apply(context, [
                        []
                    ]);
                }

                for (var i = 0; i < methods.length; ++i) {
                    var method = methods[i].method;
                    var params = methods[i].params;
                    var context = methods[i].context;

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
                    }(method, params, context));
                }
            }
        };
    };

    // This is an internal extension; do not export explicitly.
    return {
        executer: internal.objects.executer
    };
}));
