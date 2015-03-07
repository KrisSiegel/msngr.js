msngr.action("dom", function (message, wrap) {
    "use strict";

    if (msngr.utils.exists(message.dom)) {
        var norm = {
            gather: undefined,
            doc: undefined
        };
        if (!msngr.utils.isObject(message.dom)) {
            if (msngr.utils.isArray(message.dom)) {
                norm.gather = message.dom;
            } else if (msngr.utils.isString(message.dom)) {
                norm.gather = [message.dom];
            }
        } else {
            if (msngr.utils.exists(message.dom.gather)) {
                norm.gather = (msngr.utils.isArray(message.dom.gather) ? message.dom.gather : [message.dom.gather]);
            }
            if (msngr.utils.exists(message.dom.root || message.dom.doc)) {
                norm.doc = message.dom.root || message.dom.doc;
            }
        }

        if (msngr.utils.exists(norm.gather) && norm.gather.length > 0) {
            if (!msngr.utils.isObject(wrap.payload)) {
                wrap.payload = { };
            }

            for (var i = 0; i < norm.gather.length; ++i) {
                var elms = msngr.utils.findElements(norm.gather[i], message.dom.root);
                if (msngr.utils.exists(elms) && elms.length > 0) {
                    for (var j = 0; j < elms.length; ++j) {
                        var prop;
                        if (msngr.utils.exists(elms[j].getAttribute("name"))) {
                            prop = elms[j].getAttribute("name");
                        } else if (msngr.utils.exists(elms[j].id)) {
                            prop = elms[j].getAttribute("id");
                        } else {
                            prop = elms[j].tagName.toLowerCase() + j;
                        }
                        wrap.payload[prop] = elms[j].value;
                    }
                }
            }
        }
    }

    return msngr;
});
