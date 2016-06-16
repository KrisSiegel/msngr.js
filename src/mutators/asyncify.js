/*
    ./src/mutators/asyncify.js

    Takes a synchronous method and makes it work asynchronously
*/

msngr.extend(function (external, internal) {
    "use strict";

    /*
        msngr.asyncify() accepts a single parameter and returns it with a new, async method.

        fn -> the function, which should be synchronous, to add an async() method to.
    */
    external.asyncify = function(fn) {
        if (external.is(fn).function) {
            fn.async = function () {
                var args = [].slice.call(arguments);
                var callback = args.pop();
                if (external.is(callback).function) {
                    (function (a, c) {
                        external.immediate(function () {
                            try {
                                c.apply(null, [null, fn.apply(null, a)]);
                            } catch (e) {
                                c.apply(null, [e, null]);
                            }
                        });
                    }(args, callback));
                }
            };
        }

        return fn;
    };

});
