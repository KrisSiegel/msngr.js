msngr.extend((function (external, internal) {
    "use strict";

    // Throw statements
    var InvalidParameters = function (str) {
        return {
            name: "InvalidParameters",
            severity: "unrecoverable",
            message: ("Invalid parameters supplied to the {method} method".replace("{method}", str))
        };
    };

    var ReservedKeywords = function (keyword) {
        return {
            name: "ReservedKeywordsException",
            severity: "unrecoverable",
            message: ("Reserved keyword {keyword} supplied as action.".replace("{keyword}", keyword))
        };
    };

    var reservedProperties = ["topic", "category", "dataType", "payload"];
    var actions = { };
    var actionsCount = 0;

    return {
        action: function (property, handler) {
            if (!external.exist(property) || !external.exist(handler)) {
                throw InvalidParameters("action");
            }

            if (reservedProperties.indexOf(property) !== -1) {
                throw ReservedKeywords(property);
            }

            actions[property] = handler;
            actionsCount++;
        },
        inaction: function (property) {
            if (!external.exist(property)) {
                throw InvalidParameters("inaction");
            }

            delete actions[property];
            actionsCount--;
        },
        act: function (message, superWrap) {
            if (!external.exist(message) || !external.exist(superWrap)) {
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
        },
        getAvailableActions: function () {
            return Object.keys(actions);
        }
    };
}));
