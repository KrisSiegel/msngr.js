msngr.action("dom", function (message, wrap) {
    "use strict";

    if (msngr.utils.exist(message.dom)) {
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
            if (msngr.utils.exist(message.dom.gather)) {
                norm.gather = (msngr.utils.isArray(message.dom.gather) ? message.dom.gather : [message.dom.gather]);
            }
            if (msngr.utils.exist(message.dom.root || message.dom.doc)) {
                norm.doc = message.dom.root || message.dom.doc;
            }
        }

        if (msngr.utils.exist(norm.gather) && norm.gather.length > 0) {
            if (!msngr.utils.isObject(wrap.payload)) {
                wrap.payload = { };
            }

            for (var i = 0; i < norm.gather.length; ++i) {
                var elms = msngr.utils.findElements(norm.gather[i], message.dom.root);
                if (msngr.utils.exist(elms) && elms.length > 0) {
                    for (var j = 0; j < elms.length; ++j) {
                        var elm = elms[j];

                        var prop;
                        if (msngr.utils.exist(elm.getAttribute("name")) && !msngr.utils.isEmptyString(elm.getAttribute("name"))) {
                            prop = elm.getAttribute("name");
                        } else if (msngr.utils.exist(elm.id) && !msngr.utils.isEmptyString(elm.id)) {
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
