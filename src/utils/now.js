/*
    ./src/utils/now.js

    An implementation of the best-performing now() available
*/

msngr.extend(function (external, internal) {
    "use strict";

    var nowExec = undefined;
    var nowExecDebugLabel = "";
    var lastNow = undefined;

    var nowPerformance = function() {
        return performance.now();
    };

    var nowNode = function() {
        return (process.hrtime()[1] / 1000000);
    };

    var nowLegacy = function() {
        return Date.now();
    };

    external.now = function (noDuplicate) {
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
    };

});
