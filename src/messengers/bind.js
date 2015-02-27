msngr.extend((function () {
    "use strict";

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

        // How did we get here? Must be a memory leak or something
        console.log("Warning: msngr core event listener triggered without a message. Memory leak?");
        return msngr;
    };

    return {
        bind: function (element, event, message, gather) {
            if (!msngr.utils.exists(element) || !msngr.utils.exists(event) || !msngr.utils.exists(message)) {
                return undefined;
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
