msngr.extend((function () {
    "use strict";

    // Throw statements
    var InvalidParameters = function (str) {
        return {
            severity: "unrecoverable",
            message: ("Invalid parameters supplied to the {method} method".replace("{method}", str))
        };
    };

    var reservedProperties = ["topic", "category", "dataType", "payload"];
    var actions = { };
    var actionsCount = 0;

    return {
        action: function (property, handler) {
            if (!msngr.utils.exists(property) || !msngr.utils.exists(handler)) {
                throw InvalidParameters("action");
            }

            actions[property] = handler;
            actionsCount++;
        },
        inaction: function (property) {
            if (!msngr.utils.exists(property)) {
                throw InvalidParameters("inaction");
            }

            delete actions[property];
            actionsCount--;
        },
        act: function (message, superWrap) {
            if (!msngr.utils.exists(message) || !msngr.utils.exists(superWrap)) {
                throw InvalidParameters("act");
            }

            (function (msg, sw) {
                if (actionsCount > 0) {
                    var wrap = {
                        preventDefault: function () {
                            sw.preventDefault();
                        },
                        payload: sw.payload
                    };
                    for (var key in msg) {
                        if (msg.hasOwnProperty(key)) {
                            if (reservedProperties.indexOf(key) === -1) {
                                if (actions[key] !== undefined) {
                                    actions[key].apply(this, [msg, wrap]);
                                }
                            }
                        }
                    }
                    sw.payload = wrap.payload;
                }
                return sw.done();
            }(message, superWrap));
        },
        getActionCount: function () {
            return actionsCount;
        }
    };
}()));
