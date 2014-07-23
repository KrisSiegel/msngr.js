msngr.extend((function () {
    return {
        bind: function (element, event, message) {
            if (!msngr.utils.isValidMessage(message)) {
                msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
            }

            var msg = msngr.utils.ensureMessage(message);
            msg.domain = msg.domain || "local";

            for (var i = 0; i < msngr.registry.binders.count(); ++i) {
                msngr.registry.binders.get(i).bind(element, event, msg);
            }
        }
    };
}()));
