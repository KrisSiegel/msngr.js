/*
    ./src/mutators/safe.js

    Provides a safe way to access objects and functions
*/

msngr.extend(function (external, internal) {
    "use strict";

    /*
        msngr.safe() accepts 2 required parameters and 1 optional.

        obj -> the object to inspect.
        path -> the json path to a specific property separated by dots; note that this will fail if an object key actually contains a dot.
        def (optional) -> the default value to return should the requested property not exist.
    */
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

        return (external.is(position).there) ? position : def;
    };

});
