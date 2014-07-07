msngr.registry.binders.add((function () {
    var listeners = {};
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
        var func = function (e) {
            eventListeners.passThrough.apply(context, [e, message]);
        };
        console.log(func);
        return func;
    };

    return {
        bind: function (element, evnt, message) {
            if (msngr.utils.isNullOrUndefined(element)) {
                msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("element");
            }

            if (msngr.utils.isNullOrUndefined(evnt)) {
                msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("event");
            }

            if (msngr.utils.isNullOrUndefined(message)) {
                msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
            }

            if (!msngr.utils.isValidMessage(message)) {
                msngr.utils.ThrowInvalidMessage();
            }

            message = msngr.utils.ensureMessage(message);
            var elm = findElement(element);

            if (elm === undefined) {
                msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("element");
            }

            if (listeners[elm] === undefined) {
                listeners[elm] = {};
            }

            if (listeners[elm][evnt] === undefined) {
                listeners[elm][evnt] = {};
            }

            if (listeners[elm][evnt][message] === undefined) {
                listeners[elm][evnt][message] = [];
            }

            var listener = getListener(message, this);
            listeners[elm][evnt][message].push(getListener(message, this));

            elm.addEventListener(evnt, listener, false);

            return this;
        },
        unbind: function (element, evnt, message) {
            if (msngr.utils.isNullOrUndefined(element)) {
                msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("element");
            }

            if (msngr.utils.isNullOrUndefined(evnt)) {
                msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("event");
            }

            if (msngr.utils.isNullOrUndefined(message)) {
                msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
            }

            if (!msngr.utils.isValidMessage(message)) {
                msngr.utils.ThrowInvalidMessage();
            }

            message = msngr.utils.ensureMessage(message);
            var elm = findElement(element);

            if (elm === undefined) {
                msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("element");
            }

            if (listeners[elm] === undefined || listeners[elm][evnt] === undefined || listeners[elm][evnt][message] === undefined || listeners[elm][evnt][message].length === 0) {
                msngr.utils.ThrowEventNotFoundException();
            }

            for (var i = 0; i < listeners[elm][evnt][message].length; ++i) {
                elm.removeEventListener(evnt, listeners[elm][evnt][message], false);
            }
            listeners[elm][evnt][message] = [];
        }
    };
}()));
