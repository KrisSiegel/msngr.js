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
