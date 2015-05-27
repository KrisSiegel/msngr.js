/*
    ./options/cross-window.js

    The cross-window option; provides the ability to emit and receive messages across
    mupltiple browser tabs / windows within the same web browser.
*/
msngr.extend((function (external, internal) {
    "use strict";

    var channelName = "__msngr_cross-window";

    internal.options = internal.options || { };

    // Let's check if localstorage is even available. If it isn't we shouldn't register
    if (typeof localStorage === "undefined" || typeof window === "undefined") {
        return { };
    }

    window.addEventListener("storage", function (event) {
        if (event.key === channelName) {
            // New message data. Respond?

            internal.objects.message(event.newValue.message).emit(event.newValue.payload);
        }
    });

    internal.options["cross-window"] = function (message, payload, options, async) {
        // Normalize all of the inputs
        options = options || { };
        options = options["cross-window"] || { };

        localStorage.setItem(channelName, {
            message: message,
            payload: payload
        });

        return undefined;
    };

    // This is an internal extension; do not export explicitly.
    return { };
}));
