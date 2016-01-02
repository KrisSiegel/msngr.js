if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./utils/misc.js", function() {
    "use strict";

    this.timeout(60000);

    it("msngr.id() - generate 1 id", function() {
        expect(msngr.id()).to.not.equal(undefined);
    });

    it("msngr.id() - generate 100 unique ids", function() {
        var ids = [];
        for (var i = 0; i < 100; ++i) {
            var d = msngr.id();
            if (ids.indexOf(d) === -1) {
                ids.push(d);
            }
        }

        expect(ids.length).to.equal(100);
    });

    it("msngr.id() - generate 10000 unique ids", function() {
        var ids = [];
        for (var i = 0; i < 10000; ++i) {
            var d = msngr.id();
            if (ids.indexOf(d) === -1) {
                ids.push(d);
            }
        }

        expect(ids.length).to.equal(10000);
    });

    it("msngr.uuid() - generate 1 id", function() {
        expect(msngr.uuid()).to.not.equal(undefined);
    });

    it("msngr.uuid() - generate 100 unique ids", function() {
        var ids = [];
        for (var i = 0; i < 100; ++i) {
            var d = msngr.uuid();
            if (ids.indexOf(d) === -1) {
                ids.push(d);
            }
        }

        expect(ids.length).to.equal(100);
    });

    it("msngr.uuid() - generate 10000 unique ids", function() {
        var ids = [];
        for (var i = 0; i < 10000; ++i) {
            var d = msngr.uuid();
            if (ids.indexOf(d) === -1) {
                ids.push(d);
            }
        }

        expect(ids.length).to.equal(10000);
    });

    it("msngr.now() - generates a value", function() {
        expect(msngr.now()).to.exist;
    });

    it("msngr.now(true) - 5 consecutive calls have unique values", function() {
        var t1 = msngr.now(true);
        var t2 = msngr.now(true);
        var t3 = msngr.now(true);
        var t4 = msngr.now(true);
        var t5 = msngr.now(true);

        expect(t1).to.exist;
        expect(t2).to.exist;
        expect(t3).to.exist;
        expect(t4).to.exist;
        expect(t5).to.exist;

        expect(t2).to.not.equal(t1);
        expect(t3).to.not.equal(t2);
        expect(t4).to.not.equal(t3);
        expect(t5).to.not.equal(t4);
    });

    it("msngr.now('sdfkjsdfl') - Correctly handles invalid input", function() {
        var t = msngr.now("sdfkjsdfl");

        expect(t).to.exist;
    });

    it("msngr.removeFromArray - removes a value from an array", function() {
        var arr = ["something", "another", "test", "weee"];

        expect(arr[1]).to.equal("another");
        expect(arr.length).to.equal(4);

        msngr.removeFromArray(arr, "another");
        expect(arr[1]).to.equal("weee");
        expect(arr.length).to.equal(3);

        msngr.removeFromArray(arr, "test");
        expect(arr[1]).to.equal("weee");
        expect(arr.length).to.equal(2);
    });

    it("msngr.deDupeArray() - removes duplicates from an array", function() {
        var arr1 = [4,5,6,6,6,6,6,6,6,6,7];
        expect(msngr.deDupeArray(arr1).length).to.equal(4);

        var arr2 = ["yeah", "oh", "nice", "chips", "chips", "chips"];
        expect(msngr.deDupeArray(arr2).length).to.equal(4);
    });

    it("msngr.immediate() - works just like setTimeout(fn, 0)", function(done) {
        msngr.immediate(function() {
            done();
        });
    });
});
