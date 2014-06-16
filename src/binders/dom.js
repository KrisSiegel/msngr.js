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

            var elm;
            if (elm === undefined && msngr.utils.isHtmlElement(element)) {
                elm = element;
            }

            if (elm === undefined && msngr.utils.isString(element)) {
                var result = document.getElementById(element);
                result = (result !== null) ? result : document.querySelector(element);
                if (result !== null) {
                    elm = result;
                }
            }

            if (elm === undefined) {
                msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("element");
            }

            elm.addEventListener(event, function (e) {
                eventListeners.passThrough.apply(this, [e, message]);
            }, false);

            return this;
        }
    };
}()));
