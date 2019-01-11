/*
    ./src/utils/now.js

    An implementation of the best-performing now() available
*/

msngr.extend(function (external) {
    "use strict";

    var nowExec = undefined;
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
            } else if (typeof process !== "undefined") {
                nowExec = nowNode;
            } else {
                nowExec = nowLegacy;
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
