msngr.action("dom", function (message, wrap) {
    "use strict";

    if (msngr.exist(message.dom)) {
        var norm = {
            gather: undefined,
            doc: undefined
        };
        if (!msngr.isObject(message.dom)) {
            if (msngr.isArray(message.dom)) {
                norm.gather = message.dom;
            } else if (msngr.isString(message.dom)) {
                norm.gather = [message.dom];
            }
        } else {
            if (msngr.exist(message.dom.gather)) {
                norm.gather = (msngr.isArray(message.dom.gather) ? message.dom.gather : [message.dom.gather]);
            }
            if (msngr.exist(message.dom.root || message.dom.doc)) {
                norm.doc = message.dom.root || message.dom.doc;
            }
        }

        if (msngr.exist(norm.gather) && norm.gather.length > 0) {
            if (!msngr.isObject(wrap.payload)) {
                wrap.payload = { };
            }

            for (var i = 0; i < norm.gather.length; ++i) {
                var elms = msngr.findElements(norm.gather[i], message.dom.root);
                if (msngr.exist(elms) && elms.length > 0) {
                    for (var j = 0; j < elms.length; ++j) {
                        var elm = elms[j];

                        var prop;
                        if (msngr.exist(elm.getAttribute("name")) && !msngr.isEmptyString(elm.getAttribute("name"))) {
                            prop = elm.getAttribute("name");
                        } else if (msngr.exist(elm.id) && !msngr.isEmptyString(elm.id)) {
                            prop = elm.getAttribute("id");
                            console.log(elm.id);
                        } else {
                            prop = elm.tagName.toLowerCase() + j;
                        }

                        wrap.payload[prop] = elm.value;
                    }
                }
            }
        }
    }

    return msngr;
});
