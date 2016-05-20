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
