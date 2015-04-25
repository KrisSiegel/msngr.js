msngr.extend((function (external, internal) {
    "use strict";

    // Throw statements
    var InvalidParametersException = function (str) {
        return {
            severity: "unrecoverable",
            message: ("Invalid parameters supplied to the {method} method".replace("{method}", str))
        };
    };

    var UnexpectedException = function (str) {
        return {
            severity: "unrecoverable",
            message: ("An unexpected exception occured in the {method} method".replace("{method}", str))
        };
    };

    var registerdPaths = { };
    var registerdEvents = 0;

    var listener = function (event) {
        var node = this;
        var path = external.getDomPath(node);

        if (external.exist(registerdPaths[path])) {
            if (external.exist(registerdPaths[path][event.type])) {
                return msngr.emit(registerdPaths[path][event.type], event);
            }
        }

        // How did we get here? Must be a memory leak or something. Ugh
        return msngr;
    };

    return {
        bind: function (element, event, topic, category, dataType) {
            if (!external.exist(element) || !external.exist(event) || !external.exist(topic)) {
                throw InvalidParametersException("bind");
            }
            if (external.isObject(topic) && !external.exist(topic.topic)) {
                throw InvalidParametersException("bind");
            }

            var node = external.findElement(element);
            var path = external.getDomPath(node);

            if (!external.exist(registerdPaths[path])) {
                registerdPaths[path] = { };
            }

            var message = undefined;
            if (external.isObject(topic)) {
                message = topic;
            } else {
                message = { };
                message.topic = topic;

                if (external.exist(category)) {
                    message.category = category;
                }

                if (external.exist(dataType)) {
                    message.dataType = dataType;
                }
            }

            registerdPaths[path][event] = message;

            node.addEventListener(event, listener);

            registerdEvents++;

            return msngr;
        },
        unbind: function (element, event) {
            var node = external.findElement(element);
            var path = external.getDomPath(node);

            if (external.exist(registerdPaths[path])) {
                if (external.exist(registerdPaths[path][event])) {
                    node.removeEventListener(event, listener);

                    delete registerdPaths[path][event];

                    registerdEvents--;
                }
            }

            return msngr;
        },
        getBindCount: function () {
            return registerdEvents;
        }
    };
}));
