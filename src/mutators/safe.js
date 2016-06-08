/*
    ./src/mutators/safe.js

    Provides a safe way to access objects and functions
*/

msngr.extend(function (external, internal) {
    "use strict";

    external.safe = function (obj, path, def) {
        if (!external.is(obj).object || !external.is(path).string) {
            throw internal.InvalidParametersException("msngr.safe");
        }

        var props = path.split(".");
        var position = obj, prop = undefined;
        while (prop = props.shift()) {
            position = position[prop];
            if (position === undefined) {
                break;
            }
        }

        return (position || def);
    };

});
