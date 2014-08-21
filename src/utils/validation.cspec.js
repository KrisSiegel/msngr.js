if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("utils/validation.js", function () {
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
