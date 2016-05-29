/*
	./src/main.js

	The main entry point for msngr.js. Covers internal and external interface generation,
	versioning (for programmatic access) and the core extend method.
*/
var msngr = msngr || (function() {
    "use strict";

    // The internal object for holding the internal API
    var internal = { };

    // The external function that holds all external APIs
    var external = function () {
        var inputs = Array.prototype.slice.call(arguments, 0);

        this.input = inputs;
    };

    // Built version of msngr.js for programatic access; this is auto generated
    external.version = "5.0.0";

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
        set: function(value) {
            if (value === true) {
                external.internal = internal;
            } else if (value === false) {
                delete external.internal;
            }
        },
        get: function() {
            return (external.internal !== undefined)
        }
    });

    return external;
}());

/*
    ./src/exceptional.js

    Handles throwing and creating errors and warnings
*/

msngr.extend(function (external, internal) {
    "use strict";

    internal.InvalidParametersException = function(str, reason) {
        var m = {
            name: "InvalidParametersException",
            severity: "unrecoverable",
            message: ("Invalid parameters supplied to the {method} method".replace("{method}", str))
        };
        if (!external.is(reason).empty) {
            m.message = m.message + " " + reason;
        }
        return m;
    };

    internal.ReservedKeywordsException = function(keyword) {
        return {
            name: "ReservedKeywordsException",
            severity: "unrecoverable",
            message: ("Reserved keyword {keyword} supplied as action.".replace("{keyword}", keyword))
        };
    };

    internal.MangledException = function(variable, method) {
        return {
            name: "MangledException",
            severity: "unrecoverable",
            message: ("The {variable} was unexpectedly mangled in {method}.".replace("{variable}", variable).replace("{method}", method))
        };
    };

});

/*
    ./src/validators/is.js

    The is function used for validation
*/

msngr.extend(function (external, internal) {
    "use strict";

    // A list of built-in JavaScript types and their string representation
    var simpleTypes = {
        // ECMAScript 5 Types
        arguments: "[object Arguments]",
        boolean: "[object Boolean]",
        string: "[object String]",
        date: "[object Date]",
        array: "[object Array]",
        number: "[object Number]",
        object: "[object Object]",
        function: "[object Function]",
        undefined: "[object Undefined]",
        null: "[object Null]",

        // ECMAScript 6 Types
        symbol: "[object Symbol]",
        promise: "[object Promise]", // node.js 4.x returns [object Object] for promises so limited testing possible

        // HTML DOM Types
        nodelist: "[object NodeList]"
    };

    // Harder type checking here; requires custom methods
    var harderTypes = {
        // HTML DOM Types
        htmlElement: function (type) {
            return (type.indexOf("[object HTML") === 0) || (type.indexOf("[object global]") === 0);
        }
    };

    var getType = function (item) {
        return Object.prototype.toString.call(item);
    };

    // Check a type against an input
    var checkType = function (type, item, hard) {
        if (hard) {
            return harderTypes[type](getType(item));
        }
        return (getType(item) === simpleTypes[type]);
    }

    // Check an object for empiness
    var checkEmpty = function (type, item) {
        switch(type) {
            case simpleTypes.undefined:
            case simpleTypes.null:
                return true;
            case simpleTypes.string:
                if (item.trim().length === 0) {
                    return true;
                }
                return false;
            case simpleTypes.object:
                return (Object.keys(item).length === 0);
            case simpleTypes.array:
                return (item.length === 0);
            default:
                return false;
        };
    };

    // Bulld the properties that the is function returns for testing values
    var buildProps = function (inputs) {
        var props = { };

        // Create a function to call with simple and hard types
        // This is done so simple types don't need to check for hard types
        var generateProps = function (types, hard) {
            for (var t in types) {
                if (types.hasOwnProperty(t)) {
                    (function (prop) {
                        Object.defineProperty(props, prop, {
                            get: function () {
                                for (var i = 0; i < inputs.length; ++i) {
                                    if (!checkType(prop, inputs[i], hard)) {
                                        return false;
                                    }
                                }
                                return true;
                            }
                        });
                    }(t));
                }
            }
        };

        generateProps(simpleTypes, false);
        generateProps(harderTypes, true);

        // Check whether the specified inputs even exist
        Object.defineProperty(props, "there", {
            get: function () {
                for (var i = 0; i < inputs.length; ++i) {
                    if (inputs[i] === undefined || inputs[i] === null) {
                        return false;
                    }
                }
                return true;
            }
        });

        // Check whether a passed in input is considered empty or not
        Object.defineProperty(props, "empty", {
            get: function () {
                for (var i = 0; i < inputs.length; ++i) {
                    if (!checkEmpty(getType(inputs[i]), inputs[i])) {
                        return false;
                    }
                }
                return true;
            }
        });

        return props;
    };

    // Add simple types to the internal interface
    internal.types = simpleTypes;

    // The external `is` interface that supports N number of arguments.
    external.is = function () {
        var inputs = Array.prototype.slice.call(arguments, 0);

        var props = buildProps(inputs);

        // Returns the first input's type
        props.getType = function () {
            return Object.prototype.toString.call(inputs[0]);
        };

        // Returns the types for all inputs, in order
        props.getTypes = function () {
            var result = [];
            for (var i = 0; i < inputs.length; ++i) {
                result.push(Object.prototype.toString.call(inputs[i]));
            }

            return result;
        };

        return props;
    };

    // Returns whether we're in a browser or not
    external.is.browser = (typeof XMLHttpRequest !== "undefined");

});

/*
    ./src/utils/deDupeArray.js

    Provides a funtion for de-duping an array
*/

msngr.extend(function (external, internal) {
    "use strict";

    external.deDupeArray = function (arr) {
        var hash = { };
        var result = [];
        var arrLength = arr.length;
        for (var i = 0; i < arrLength; ++i) {
            if (hash[arr[i]] === undefined) {
                hash[arr[i]] = true;
                result.push(arr[i]);
            }
        }

        return result;
    };

});

/*
    ./src/utils/identifier.js

    Utils for handling and creating identifiers
*/

msngr.extend(function (external, internal) {
    "use strict";

    var atomicCount = 0;
    var seed = "Mxxx".replace(/[x]/g, function () {
        return Math.floor(Math.random() * 100);
    });

    external.id = function () {
        ++atomicCount;
        return (seed + atomicCount);
    };

    external.uuid = function () {
        var d = external.now();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

});

/*
    ./src/utils/immediate.js

    A cross platform implementation of immediate()
*/

msngr.extend(function (external, internal) {
    "use strict";
    var immediateFn;

    // This chunk of code is only for the browser as a setImmediate workaround
    if (typeof window !== "undefined" && typeof window.postMessage !== "undefined") {
        var postMessageChannel = "__msngr_immediate";
        var immediateQueue = [];

        window.addEventListener("message", function(event) {
            if (event.source === window && event.data === postMessageChannel) {
                event.stopPropagation();
                if (immediateQueue.length > 0) {
                    immediateQueue.shift()();
                }
            }
        }, true);
    }

    external.immediate = function(fn) {
        if (immediateFn === undefined) {
            if (typeof setImmediate !== "undefined") {
                immediateFn = setImmediate;
            } else if (typeof window !== "undefined" && typeof window.postMessage !== "undefined") {
                immediateFn = function(f) {
                    immediateQueue.push(f);
                    window.postMessage(external.config.get("msngr.immediate").channel, "*");
                };
            } else {
                immediateFn = function(f) {
                    setTimeout(f, 0);
                };
            }
        }
        immediateFn(fn);
    };

});

/*
    ./src/utils/now.js

    An implementation of the best-performing now() available
*/

msngr.extend(function (external, internal) {
    "use strict";

    var nowExec = undefined;
    var nowExecDebugLabel = "";
    var lastNow = undefined;

    var nowPerformance = function() {
        return performance.now();
    };

    var nowNode = function() {
        return (process.hrtime()[1] / 1000000);
    };

    var nowLegacy = function() {
        return Date.now();
    };

    external.now = function (noDuplicate) {
        if (nowExec === undefined) {
            if (typeof performance !== "undefined") {
                nowExec = nowPerformance;
                nowExecDebugLabel = "performance";
            } else if (typeof process !== "undefined") {
                nowExec = nowNode;
                nowExecDebugLabel = "node";
            } else {
                nowExec = nowLegacy;
                nowExecDebugLabel = "legacy";
            }
        }
        var now = nowExec();
        if (noDuplicate === true && lastNow === now) {
            return external.now(noDuplicate);
        }
        lastNow = now;
        return now;
    };

});

/*
    ./src/mutators/asyncify.js

    Takes a synchronous method and makes it work asynchronously
*/

msngr.extend(function (external, internal) {
    "use strict";

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

/*
    ./src/mutators/copy.js

    Creates a copy of the passed in object
*/

msngr.extend(function (external, internal) {
    "use strict";

    var copyHandlers = { };
    // Immutable types that can be straight returned
    copyHandlers[internal.types.string] = function (str) { return str; };
    copyHandlers[internal.types.number] = function (num) { return num; };
    copyHandlers[internal.types.boolean] = function (bool) { return bool; };

    // Mutable types that need to be specially handled
    copyHandlers[internal.types.date] = function (d) {
        var cdate = new Date();
        cdate.setTime(d.getTime());

        return cdate;
    };

    copyHandlers[internal.types.object] = function (obj) {
        var cobj = { };
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                cobj[key] = external.copy(obj[key]);
            }
        }

        return cobj;
    };

    copyHandlers[internal.types.array] = function (arr) {
        var carr = [];
        for (var i = 0; i < arr.length; i++) {
            carr[i] = external.copy(arr[i]);
        }

        return carr;
    };

    copyHandlers[internal.types.function] = function (fn) {
        var cfn = fn.bind({}); // Pulls the function away from its properties
        for (var key in fn) {
            if (fn.hasOwnProperty(key)) {
                cfn[key] = external.copy(fn[key]);
            }
        }

        return cfn;
    };

    // Accepts any input and attempts to copy it
    // Unknown input is simply returned as is and is NOT copied
    // While that sounds incorrect there are custom types that may or may not
    // be copy-able so this is basically the best case scenario.
    external.copy = function (input) {
        if (input === undefined || input === null) {
            return input;
        }

        var inputType = external.is(input).getType();

        if (copyHandlers[inputType] !== undefined) {
            return copyHandlers[inputType](input);
        }

        // Return the input since we don't know what it is.
        return input;
    };

});

/*
    ./src/mutators/merge.js

    Creates a merged object from the input
*/

msngr.extend(function (external, internal) {
    "use strict";

    // Merge two items together and return the result
    var twoMerge = function (obj1, obj2) {
        if (obj1 === undefined || obj1 === null) { return obj2; };
        if (obj2 === undefined || obj2 === null) { return obj1; };

        var obj1Type = external.is(obj1).getType();
        var obj2Type = external.is(obj2).getType();

        var acceptableForObj1 = [internal.types.object, internal.types.function, internal.types.array];
        var acceptableForObj2 = [internal.types.object, internal.types.array];

        if (acceptableForObj1.indexOf(obj1Type) === -1 || acceptableForObj2.indexOf(obj2Type) === -1) {
            throw internal.InvalidParametersException("msngr.merge()", "Only objects, arrays or a single function followed by objects can be merged!");
        }

        if ([obj1Type, obj2Type].indexOf(internal.types.array) !== -1 && (obj1Type !== internal.types.array || obj2Type !== internal.types.array)) {
            throw internal.InvalidParametersException("msngr.merge()", "Arrays cannot be merged with objects or functions!");
        }

        var result = obj1;

        // If we're in the weird spot of getting only arrays then concat and return
        // Seriously though, Mr or Mrs or Ms dev, but just use Array.prototype.concat()!
        if (obj1Type === internal.types.array && obj2Type === internal.types.array) {
            return obj1.concat(obj2);
        }

        for (var key in obj2) {
            if (obj2.hasOwnProperty(key)) {
                var is = external.is(obj2[key]);
                if (is.object) {
                    result[key] = result[key] || { };
                    result[key] = twoMerge(result[key], obj2[key]);
                } else if (is.array) {
                    result[key] = result[key] || [];
                    result[key] = result[key].concat(obj2[key]);
                } else {
                    result[key] = obj2[key];
                }
            }
        }

        return result;
    };

    // Takes N number of inputs and merges them together
    // The next parameter always wins over the previous one
    external.merge = function () {
        var inputs = Array.prototype.slice.call(arguments, 0);

        if (inputs.length <= 1) {
            return inputs[0];
        }

        var result = inputs.shift();
        while (inputs.length > 0) {
            result = twoMerge(result, inputs.shift());
        }

        return result;
    };

});

/*
	module.exports.js

	If we're running in a node.js.
*/
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = msngr;
}
