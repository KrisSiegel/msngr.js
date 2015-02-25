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
            var node = msngr.utils.findElement(element);
            var path = msngr.utils.getDomPath(node);

            if (!msngr.utils.exists(registerdPaths[path])) {
                registerdPaths[path] = { };
            }

            if (msngr.utils.exists(gather)) {
                if (!msngr.utils.exists(message.options)) {
                    message.options = { };
                }
                message.options.dom = message.options.dom || { };
                if (msngr.utils.exists(message.options.dom.gather)) {
                    msngr.extend(gather, message.options.dom.gather);
                } else {
                    message.options.dom.gather = gather;
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
