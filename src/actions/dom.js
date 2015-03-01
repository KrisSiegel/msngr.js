msngr.action("dom", function (message, wrap) {
    "use strict";

    if (msngr.utils.exists(message.dom.gather)) {
        var toGet = (msngr.utils.isArray(message.dom.gather) ? message.dom.gather : [message.dom.gather]);
        wrap.payload.gathered = { };

        for (var i = 0; i < toGet.length; ++i) {
            var elm = msngr.utils.findElement(toGet[i]);
            if (msngr.utils.exists(elm) && msngr.utils.exists(elm.getAttribute("name"))) {
                wrap.payload.gathered[elm.getAttribute("name")] = elm.value;
            }
        }
    }
});
