/*
    ./src/utils/immediate.js

    A cross platform implementation of immediate()
*/

msngr.extend(function (external, internal) {
    "use strict";
    var postMessageChannel = "__msngr_immediate";
    var immediateFn;

    // This chunk of code is only for the browser as a setImmediate workaround
    if (typeof window !== "undefined" && typeof window.postMessage !== "undefined") {
        var immediateQueue = [];

        window.addEventListener("message", function(event) {
            if (event.source === window && event.data === postMessageChannel) {
                event.stopPropagation();
                if (immediateQueue.length > 0) {
                    immediateQueue.shift()();
                }
            }
        }, true);
    }

    external.immediate = function(fn) {
        if (immediateFn === undefined) {
            if (typeof setImmediate !== "undefined") {
                immediateFn = setImmediate;
            } else if (typeof window !== "undefined" && typeof window.postMessage !== "undefined") {
                immediateFn = function(f) {
                    immediateQueue.push(f);
                    window.postMessage(postMessageChannel, "*");
                };
            } else {
                immediateFn = function(f) {
                    setTimeout(f, 0);
                };
            }
        }
        immediateFn(fn);
    };

});
