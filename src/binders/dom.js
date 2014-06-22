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

    var findElement = function (element) {
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

        return elm;
    };

    var getListener = function (message, context) {
        return function (e) {
            eventListeners.passThrough.apply(context, [e, message]);
        };
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

            var elm = findElement(element);

            if (elm === undefined) {
                msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("element");
            }

            elm.addEventListener(event, getListener(message, this), false);

            return this;
        },
        unbind: function (element, event, message) {
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

            var elm = findElement(element);

            if (elm === undefined) {
                msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("element");
            }

            elm.removeEventListener(event, getListener(message, this));
        }
    };
}()));
