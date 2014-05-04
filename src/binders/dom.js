msngr.registry.binders.add((function () {

    var eventListeners = {
        passThrough: function (e, message) {
            msngr.send({
                topic: message.topic,
                category: message.category,
                dataType: message.dataType,
                payload: e
            });
        }
    };

    return {
        bind: function (element, event, message) {
            if (msngr.utils.isNullOrUndefined(element)) {
                msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("element");
            }

            if (msngr.utils.isNullOrUndefined(event)) {
                msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("event");
            }

            if (msngr.utils.isNullOrUndefined(message)) {
                msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
            }

            if (!msngr.utils.isValidMessage(message)) {
                msngr.utils.ThrowInvalidMessage();
            }

            // Assume element is a valid HTMLElement.
            // TODO: Expand scope to support element being: a selector, an array of selectors,
            // an array of HTMLElement, a NodeList of HTMLElements

            element.addEventListener(event, function (e) {
                eventListeners.passThrough.apply(this, [e, message]);
            }, false);

            return this;
        }
    };
}()));
