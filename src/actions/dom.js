msngr.action("dom", function (message, wrap) {
    "use strict";

    if (msngr.utils.exists(message.dom.gather)) {
        var toGet = (msngr.utils.isArray(message.dom.gather) ? message.dom.gather : [message.dom.gather]);
        if (!msngr.utils.isObject(wrap.payload)) {
            wrap.payload = { };
        }

        for (var i = 0; i < toGet.length; ++i) {
            var elm = msngr.utils.findElement(toGet[i]);
            if (msngr.utils.exists(elm) && msngr.utils.exists(elm.getAttribute("name"))) {
                wrap.payload[elm.getAttribute("name")] = elm.value;
            }
        }
    }
});
