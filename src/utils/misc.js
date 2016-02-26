msngr.extend((function(external, internal) {
    "use strict";

    // This chunk of code is only for the browser as a setImmediate workaround
    if (typeof window !== "undefined" && typeof window.postMessage !== "undefined") {
        external.config("immediate", {
            channel: "__msngr_immediate"
        });

        var immediateQueue = [];

        window.addEventListener("message", function(event) {
            if (event.source === window && event.data === internal.config["immediate"].channel) {
                event.stopPropagation();
                if (immediateQueue.length > 0) {
                    immediateQueue.shift()();
                }
            }
        }, true);
    }

    var nowPerformance = function() {
        return performance.now();
    };

    var nowNode = function() {
        return (process.hrtime()[1] / 1000000);
    };

    var nowLegacy = function() {
        return Date.now();
    };

    var nowExec = undefined;
    var nowExecDebugLabel = "";
    var lastNow = undefined;
    var isBrowserCached;
    var immediateFn;
    var atomicCount = 0;
    var seed = "Mxx".replace(/[x]/g, function() {
        return Math.floor(Math.random() * 100);
    });

    return {
        id: function() {
            ++atomicCount;
            return (seed + atomicCount);
        },
        uuid: function() {
            var d = external.now();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        },
        now: function(noDuplicate) {
            if (nowExec === undefined) {
                if (typeof performance !== "undefined") {
                    nowExec = nowPerformance;
                    nowExecDebugLabel = "performance";
                } else if (typeof process !== "undefined") {
                    nowExec = nowNode;
                    nowExecDebugLabel = "node";
                } else {
                    nowExec = nowLegacy;
                    nowExecDebugLabel = "legacy";
                }
            }
            var now = nowExec();
            if (noDuplicate === true && lastNow === now) {
                return external.now(noDuplicate);
            }
            lastNow = now;
            return now;
        },
        removeFromArray: function(arr, value) {
            var inx = arr.indexOf(value);
            var endIndex = arr.length - 1;
            if (inx !== endIndex) {
                var temp = arr[endIndex];
                arr[endIndex] = arr[inx];
                arr[inx] = temp;
            }
            arr.pop();
        },
        deDupeArray: function(arr) {
            var hash = { };
            var result = [];
            var arrLength = arr.length;
            for (var i = 0; i < arrLength; ++i) {
                if (hash[arr[i]] === undefined) {
                    hash[arr[i]] = true;
                    result.push(arr[i]);
                }
            }

            return result;
        },
        isBrowser: function() {
            if (isBrowserCached === undefined) {
                isBrowserCached = (typeof XMLHttpRequest !== "undefined");
            }
            return isBrowserCached;
        },
        immediate: function(fn) {
            if (immediateFn === undefined) {
                if (typeof setImmediate !== "undefined") {
                    immediateFn = setImmediate;
                } else if (typeof window !== "undefined" && typeof window.postMessage !== "undefined") {
                    immediateFn = function(f) {
                        immediateQueue.push(f);
                        window.postMessage(internal.config["immediate"].channel, "*");
                    };
                } else {
                    immediateFn = function(f) {
                        setTimeout(f, 0);
                    };
                }
            }
            immediateFn(fn);
        },
        asyncify: function(fn) {
            if (external.isFunction(fn)) {
                fn.async = function () {
                    var args = [].slice.call(arguments);
                    var callback = args.pop();
                    if (external.isFunction(callback)) {
                        (function (a, c) {
                            external.immediate(function () {
                                try {
                                    c.apply(null, [null, fn.apply(null, a)]);
                                } catch (e) {
                                    c.apply(null, [e, null]);
                                }
                            });
                        }(args, callback));
                    }
                };
            }

            return fn;
        }
    };
}));
