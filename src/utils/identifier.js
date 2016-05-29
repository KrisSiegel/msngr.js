/*
    ./src/utils/identifier.js

    Utils for handling and creating identifiers
*/

msngr.extend(function (external, internal) {
    "use strict";

    var atomicCount = 0;
    var seed = "Mxxx".replace(/[x]/g, function () {
        return Math.floor(Math.random() * 100);
    });

    external.id = function () {
        ++atomicCount;
        return (seed + atomicCount);
    };

    external.uuid = function () {
        var d = external.now();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

});
