/*
	./src/main.js

	The main entry point for msngr.js. Covers internal and external interface generation,
	versioning (for programmatic access) and the core extend method.
*/
var msngr = msngr || (function () {
    "use strict";

    // The internal object for holding the internal API
    var internal = { };

    // The external function that holds all external APIs
    var external = function () {
        var inputs = Array.prototype.slice.call(arguments, 0);

        return external.message.apply(this, inputs);
    };

    // Built version of msngr.js for programatic access; this is auto generated
    external.version = "5.0.1";

    // Takes a function, executes it passing in the external and internal interfaces
    external.extend = function (fn) {
        if (fn === undefined || fn === null) {
            return undefined;
        }

        var fnType = Object.prototype.toString.call(fn);
        if (fnType !== "[object Function]") {
            return undefined;
        }

        return fn.apply(this, [external, internal]);
    };

    // Create a debug property to allow explicit exposure to the internal object structure.
    // This should only be used during unit test runs and debugging.
    Object.defineProperty(external, "debug", {
        set: function (value) {
            if (value === true) {
                external.internal = internal;
            } else if (value === false) {
                delete external.internal;
            }
        },
        get: function () {
            return (external.internal !== undefined)
        }
    });

    return external;
}());
