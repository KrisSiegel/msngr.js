/*msngr.extend((function (external, internal) {
    "use strict";

    var reservedProperties = ["topic", "category", "dataType", "payload"];
    var actions = { };
    var actionsCount = 0;

    return {
        action: function (property, handler) {
            if (!external.exist(property) || !external.exist(handler)) {
                throw internal.InvalidParametersException("action");
            }

            if (reservedProperties.indexOf(property) !== -1) {
                throw internal.ReservedKeywordsException(property);
            }

            actions[property] = handler;
            actionsCount++;
        },
        inaction: function (property) {
            if (!external.exist(property)) {
                throw internal.InvalidParametersException("inaction");
            }

            delete actions[property];
            actionsCount--;
        },
        act: function (message, superWrap) {
            if (!external.exist(message) || !external.exist(superWrap)) {
                throw internal.InvalidParametersException("act");
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
*/
