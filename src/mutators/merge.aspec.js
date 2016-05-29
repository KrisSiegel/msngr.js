if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./mutators/merge.js", function () {
    "use strict";

    it("msngr.merge() - expect merge() method to exist", function () {
        expect(msngr.merge).to.exist;
    });

    it("msngr.merge() - handles invalid input correctly", function () {
        expect(msngr.merge.bind()).to.throw;
        expect(msngr.merge.bind([], { })).to.throw;
        expect(msngr.merge.bind({ }, [])).to.throw;
        expect(msngr.merge.bind(function () {}, [])).to.throw;
        expect(msngr.merge.bind("", "")).to.throw;
        expect(msngr.merge.bind(5, 15)).to.throw;
        expect(msngr.merge.bind(true, false)).to.throw;
    });

    it("msngr.merge() - expect merge() to combine two flat objects correctly", function () {
        var obj1 = {
            mystr: "str-yo",
            mybool: true,
            mynum: 5
        };

        var obj2 = {
            mystr: "chicken",
            other: 15,
            mybool: false
        };

        var combined = msngr.merge(obj1, obj2);

        expect(combined).to.exist;
        expect(combined.mystr).to.equal("chicken");
        expect(combined.mybool).to.equal(false);
        expect(combined.other).to.equal(15);
    });

    it("msngr.merge() - expect merge() to combine two arrays correctly", function () {
        var arr1 = [1, 3, 15];
        var arr2 = [6, 99, 57];

        expect(msngr.merge(arr1, arr2).length).to.equal(6);
    });

    it("msngr.merge() - expect merge() to combine 3, complex objects correctly", function () {
        var obj1 = {
            something: [2, 19, 43],
            truthy: true,
            more: {
                or: {
                    less: 15
                }
            }
        };

        var obj2 = {
            truthy: false,
            something: [9],
            more: {
                or: {
                    less: 42
                }
            }
        };

        var obj3 = {
            truthy: null,
            something: [8],
            more: {
                or: {
                    less: 99
                }
            }
        };

        var merged = msngr.merge(obj1, obj2, obj3);
        expect(merged.something.length).to.equal(5);
        expect(merged.more.or.less).to.equal(99);
        expect(merged.truthy).to.equal(null);
    });

});
