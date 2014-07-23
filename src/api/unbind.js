msngr.extend((function () {
    return {
        unbind: function (element, event, message) {
            if (!msngr.utils.isValidMessage(message)) {
                msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
            }

            for (var i = 0; i < msngr.registry.binders.count(); ++i) {
                msngr.registry.binders.get(i).unbind(element, event, msngr.utils.ensureMessage(message));
            }
        }
    };
}()));
