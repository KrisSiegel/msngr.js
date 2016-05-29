if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./utils/deDupeArray.js", function () {
    "use strict";

    it("msngr.deDupeArray() - removes duplicates from an array", function() {
        var arr1 = [4,5,6,6,6,6,6,6,6,6,7];
        expect(msngr.deDupeArray(arr1).length).to.equal(4);

        var arr2 = ["yeah", "oh", "nice", "chips", "chips", "chips"];
        expect(msngr.deDupeArray(arr2).length).to.equal(4);
    });

});
