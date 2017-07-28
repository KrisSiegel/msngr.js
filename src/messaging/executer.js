/*
    ./src/messaging/executer.js

    Executer provides asynchronous execution of indexed methods
*/

msngr.extend(function (external, internal) {
    "use strict";

    internal.executer = function (methods) {
        // Support passing in just methods
        for (var i = 0; i < methods.length; ++i) {
            if (external.is(methods[i]).function) {
                methods[i] = {
                    method: methods[i]
                };
            }
        }

        var exec = function (method, params, ctx, done) {
            var isParams = external.is(params);
            external.immediate(function () {
                var asyncFlag = false;
                var asyncFunc = function () {
                    asyncFlag = true;
                    return function (result) {
                        done.apply(ctx, [result]);
                    };
                }

                if (!isParams.array) {
                    if (isParams.there) {
                        params = [params];
                    } else {
                        params = [];
                    }
                }
                params.push(asyncFunc);
                var syncResult = method.apply(ctx || undefined, params);
                if (asyncFlag !== true) {
                    done.apply(ctx, [syncResult]);
                }
            });
        };

        return {
            parallel: function (done) {
                var isDone = external.is(done);
                var results = [];
                var executed = 0;

                if (methods.length === 0 && isDone.there) {
                    return done.apply(null, [ [] ]);
                }

                for (var i = 0; i < methods.length; ++i) {
                    var method = methods[i].method;
                    var params = methods[i].params;
                    var context = methods[i].context;

                    (function (_method, _params, _context) {
                        exec(_method, _params, _context, function(result) {
                            if (external.is(result).there) {
                                results.push(result);
                            }

                            ++executed;

                            if (executed === methods.length && isDone.there) {
                                done.apply((_context || null), [results]);
                            }
                        });
                    }(method, params, context));
                }
            },
            series: function (done) {
                var isDone = external.is(done);
                var results = [];

                if (methods.length === 0 && isDone.there) {
                    return done.apply(null, [ [] ]);
                }

                var again = function () {
                    var method = methods.shift();
                    (function (_method, _params, _context) {
                        exec(_method, _params, _context, function (result) {
                            if (external.is(result).there) {
                                results.push(result);
                            }

                            if (methods.length === 0 && isDone.there) {
                                done.apply((_context || null), [results]);
                            } else {
                                again();
                            }
                        });
                    }(method.method, method.params, method.context));
                };
                again();
            }
        };
    };

    external.parallel = function (methods, handler) {
        internal.executer(methods).parallel.apply(this, [handler]);
    };

    external.series = function (methods, handler) {
        internal.executer(methods).series.apply(this, [handler]);
    };

});
