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
        nodeList: "[object NodeList]"
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
