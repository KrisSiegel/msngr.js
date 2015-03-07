msngr.extend((function () {
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
        var path = msngr.utils.getDomPath(node);

        if (msngr.utils.exists(registerdPaths[path])) {
            if (msngr.utils.exists(registerdPaths[path][event.type])) {
                return msngr.emit(registerdPaths[path][event.type], event);
            }
        }

        // How did we get here? Must be a memory leak or something. Ugh
        return msngr;
    };

    return {
        bind: function (element, event, topic, category, dataType) {
            if (!msngr.utils.exists(element) || !msngr.utils.exists(event) || !msngr.utils.exists(topic)) {
                throw InvalidParametersException("bind");
            }
            if (msngr.utils.isObject(topic) && !msngr.utils.exists(topic.topic)) {
                throw InvalidParametersException("bind");
            }

            var node = msngr.utils.findElement(element);
            var path = msngr.utils.getDomPath(node);

            if (!msngr.utils.exists(registerdPaths[path])) {
                registerdPaths[path] = { };
            }

            var message = undefined;
            if (msngr.utils.isObject(topic)) {
                message = topic;
            } else {
                message = { };
                message.topic = topic;

                if (msngr.utils.exists(category)) {
                    message.category = category;
                }

                if (msngr.utils.exists(dataType)) {
                    message.dataType = dataType;
                }
            }

            registerdPaths[path][event] = message;

            node.addEventListener(event, listener);

            registerdEvents++;

            return msngr;
        },
        unbind: function (element, event) {
            var node = msngr.utils.findElement(element);
            var path = msngr.utils.getDomPath(node);

            if (msngr.utils.exists(registerdPaths[path])) {
                if (msngr.utils.exists(registerdPaths[path][event])) {
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
}()));
