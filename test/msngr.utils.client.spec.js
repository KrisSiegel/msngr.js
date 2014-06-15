if (typeof assert === "undefined" && typeof window === "undefined") {
    var assert = require("assert");
}
if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

var expect = chai.expect;

var tests = (function (description, msngrPath, uniqueKey) {
    describe(description, function () {
        it("msngr.utils.isHtmlElement(obj)", function () {
            expect(msngr.utils.isHtmlElement(function () {})).to.equal(false);
            expect(msngr.utils.isHtmlElement("test")).to.equal(false);
            expect(msngr.utils.isHtmlElement("")).to.equal(false);
            expect(msngr.utils.isHtmlElement(undefined)).to.equal(false);
            expect(msngr.utils.isHtmlElement(null)).to.equal(false);
            expect(msngr.utils.isHtmlElement({})).to.equal(false);
            expect(msngr.utils.isHtmlElement(7)).to.equal(false);
            expect(msngr.utils.isHtmlElement([])).to.equal(false);
            expect(msngr.utils.isHtmlElement(new Date())).to.equal(false);
            expect(msngr.utils.isHtmlElement(document.createElement("div"))).to.equal(true);
            expect(msngr.utils.isHtmlElement(document.createElement("input"))).to.equal(true);
            expect(msngr.utils.isHtmlElement(document.createElement("body"))).to.equal(true);
            expect(msngr.utils.isHtmlElement(document.createElement("canvas"))).to.equal(true);
        });
    });

});
tests("msngr.utils", undefined, Math.floor(Math.random() * 1000));
