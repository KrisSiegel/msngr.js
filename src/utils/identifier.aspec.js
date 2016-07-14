if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./utils/identifier.js", function () {
    "use strict";

    this.timeout(5000);

    it("msngr.id() - generate 1 id", function () {
        expect(msngr.id()).to.not.equal(undefined);
    });

    it("msngr.id() - generate 100 unique ids", function () {
        var ids = [];
        for (var i = 0; i < 100; ++i) {
            var d = msngr.id();
            if (ids.indexOf(d) === -1) {
                ids.push(d);
            }
        }

        expect(ids.length).to.equal(100);
    });

    it("msngr.id() - generate 10000 unique ids", function () {
        var ids = [];
        for (var i = 0; i < 10000; ++i) {
            var d = msngr.id();
            if (ids.indexOf(d) === -1) {
                ids.push(d);
            }
        }

        expect(ids.length).to.equal(10000);
    });

    it("msngr.uuid() - generate 1 id", function () {
        expect(msngr.uuid()).to.not.equal(undefined);
    });

    it("msngr.uuid() - generate 100 unique ids", function () {
        var ids = [];
        for (var i = 0; i < 100; ++i) {
            var d = msngr.uuid();
            if (ids.indexOf(d) === -1) {
                ids.push(d);
            }
        }

        expect(ids.length).to.equal(100);
    });

    it("msngr.uuid() - generate 10000 unique ids", function () {
        var ids = [];
        for (var i = 0; i < 10000; ++i) {
            var d = msngr.uuid();
            if (ids.indexOf(d) === -1) {
                ids.push(d);
            }
        }

        expect(ids.length).to.equal(10000);
    });

});
