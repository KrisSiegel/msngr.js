if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./validators/is.js", function () {
    "use strict";

    // Before each test let's remove all children from the body of the document
    beforeEach(function() {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it("msngr.is.browser - expects to return true when in a web browser", function () {
        expect(msngr.is.browser).to.equal(true);
    });

    it("msngr.is(obj).htmlElement - obj is a div element", function() {
        expect(msngr.is(document.createElement("div")).htmlElement).to.equal(true);
    });

    it("msngr.is(obj).htmlElement - obj is an input element", function() {
        expect(msngr.is(document.createElement("input")).htmlElement).to.equal(true);
    });

    it("msngr.is(obj).htmlElement - obj is a body element", function() {
        expect(msngr.is(document.createElement("body")).htmlElement).to.equal(true);
    });

    it("msngr.is(obj).htmlElement - obj is a canvas element", function() {
        expect(msngr.is(document.createElement("canvas")).htmlElement).to.equal(true);
    });

    it("msngr.is(obj).nodeList - obj is a nodelist", function() {
        var div1 = document.createElement("div");
        var div2 = document.createElement("div");
        var div3 = document.createElement("div");

        div1.appendChild(div2);
        div1.appendChild(div3);
        
        expect(msngr.is(div1.childNodes).nodeList).to.equal(true);
    });

});
