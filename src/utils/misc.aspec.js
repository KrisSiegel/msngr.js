if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("utils/misc.js", function () {
    it("msngr.utils.arrayContains()", function () {
        expect(msngr.utils.arrayContains([1,2,3], 2)).to.equal(true);
        expect(msngr.utils.arrayContains([1,2,3], 0)).to.equal(false);
        expect(msngr.utils.arrayContains([1,2,3], [1,2])).to.equal(true);
        expect(msngr.utils.arrayContains([1,2,3], [0,1])).to.equal(false);
    });

    it("msngr.utils.id()", function () {
        expect(msngr.utils.id()).to.not.equal(undefined);

        var ids = [];
        for (var i = 0; i < 10000; ++i) {
            var d = msngr.utils.id();
            if (ids.indexOf(d) === -1) {
                ids.push(d);
            }
        }

        expect(ids.length).to.equal(10000);
    });
});
