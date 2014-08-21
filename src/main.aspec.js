if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../msngr");
}

describe("main.js", function () {
    it("msngr", function () {
        // Ensure msngr exists in the first place
        expect(msngr).to.not.equal(undefined);
    });

    it("msngr.extend()", function () {
        // Check that extend exists
        expect(msngr.extend).to.not.equal(undefined);
        // Ensure that the method we're adding doesn't exist
        expect(msngr.test_extend).to.equal(undefined);
        // Extend msngr with new method
        msngr.extend({
            test_extend: function () {

            }
        });
        // Ensure new method now exists
        expect(msngr.test_extend).to.not.equal(undefined);
        // Drop new method
        delete msngr.test_extend;
        // Ensure new method is gone again
        expect(msngr.test_extend).to.equal(undefined);

        // Complex extend
        msngr.extend({
            test_extend: {
                test: "test"
            }
        });
        msngr.extend({
            test_extend: {
                another: "test"
            }
        });
        expect(msngr.test_extend.test).to.equal(msngr.test_extend.another);
        expect(msngr.test_extend.test).to.not.equal(msngr.test);
        // Drop new methods again
        delete msngr.test_extend;

        // Check mixin support with arrays; no modifying of base msngr object.
        var obj = msngr.extend({
            testing: {
                tests: ["test", "again"]
            },
            another: ["yup", "yip", "yop"]
        }, {
            testing: {
                test: "yes",
                tests: ["another", "weee"]
            }
        });
        expect(obj.testing.tests.length > 0).to.equal(true);
        expect(obj.testing.tests.length === 4).to.equal(true);
        expect(obj.another.length > 0).to.equal(true);
        expect(msngr.utils.getType(obj.testing.tests)).to.equal("[object Array]");
        expect(msngr.utils.getType(obj.another)).to.equal("[object Array]");
    });
});
