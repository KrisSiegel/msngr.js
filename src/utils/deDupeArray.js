/*
    ./src/utils/deDupeArray.js

    Provides a funtion for de-duping an array
*/

msngr.extend(function (external, internal) {
    "use strict";

    external.deDupeArray = function (arr) {
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
    };

});
