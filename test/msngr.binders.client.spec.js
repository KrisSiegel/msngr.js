if (typeof assert === "undefined" && typeof window === "undefined") {
    var assert = require("assert");
}
if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

var expect = chai.expect;

var tests = (function (description, msngrPath, uniqueKey) {
    describe(description, function () {
        it("At least one binder is registered", function () {
            expect((msngr.registry.binders.count() > 0)).to.equal(true);
        });
    });

});
tests("msngr.binders", undefined, Math.floor(Math.random() * 1000));
