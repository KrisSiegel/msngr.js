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
        bind: function (element, event, message, gather) {
            if (!msngr.utils.exists(element) || !msngr.utils.exists(event) || !msngr.utils.exists(message)) {
                throw InvalidParametersException("bind");
            }
            var node = msngr.utils.findElement(element);
            var path = msngr.utils.getDomPath(node);

            if (!msngr.utils.exists(registerdPaths[path])) {
                registerdPaths[path] = { };
            }

            if (!msngr.utils.exists(message.dom)) {
                message.dom = { };
            }

            if (!msngr.utils.exists(message.dom.gather)) {
                message.dom.gather = [];
            } else {
                if (!msngr.utils.isArray(message.dom.gather)) {
                    message.dom.gather = [message.dom.gather];
                }
            }

            if (msngr.utils.exists(gather)) {
                if (!msngr.utils.isArray(gather)) {
                    message.dom.gather.push(gather);
                } else {
                    message.dom.gather = message.dom.gather.concat(gather);
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
