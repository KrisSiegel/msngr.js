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
