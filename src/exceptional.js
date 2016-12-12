/*
    ./src/exceptional.js

    Handles throwing and creating errors and warnings
*/

msngr.extend(function (external, internal) {
    "use strict";

    internal.InvalidParametersException = function (methodName, reason) {
        var m = {
            name: "InvalidParametersException",
            severity: "unrecoverable",
            message: ("Invalid parameters supplied to the {method} method".replace("{method}", methodName))
        };
        if (!external.is(reason).empty) {
            m.message = m.message + " " + reason;
        }
        return m;
    };

    internal.DuplicateException = function (methodName) {
        return {
            name: "DuplicateException",
            severity: "unrecoverable",
            message: ("Duplicate input provided to {method} where duplicates are not allowed.".replace("{method}", methodName))
        };
    };

    internal.ReservedKeywordsException = function (keyword) {
        return {
            name: "ReservedKeywordsException",
            severity: "unrecoverable",
            message: ("Reserved keyword {keyword} supplied as action.".replace("{keyword}", keyword))
        };
    };

    internal.MangledException = function (variable, methodName) {
        return {
            name: "MangledException",
            severity: "unrecoverable",
            message: ("The {variable} was unexpectedly mangled in {method}.".replace("{variable}", variable).replace("{method}", methodName))
        };
    };

});
