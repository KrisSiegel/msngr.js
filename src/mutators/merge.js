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
        var obj12ype = external.is(obj2).getType();

        if (obj1Type !== internal.types.object || obj1Type !== internal.types.function || obj2Type !== internal.types.object) {
            throw internal.InvalidParametersException("msngr.merge()", "Only objects or a single function followed by objects can be merged");
        }

        var result = obj1;
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
