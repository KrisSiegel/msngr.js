if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./mutators/safe.js", function () {
    "use strict";

    it("msnge.safe() - Throws on incorrect parameters", function () {
        expect(msngr.safe.bind()).to.throw;
        expect(msngr.safe.bind({ })).to.throw;
        expect(msngr.safe.bind(15, "yeah")).to.throw;
        expect(msngr.safe.bind(new Date())).to.throw;
        expect(msngr.safe.bind(true)).to.throw;
    });

    it("msngr.safe() - Accesses a property at zero depth successfully", function () {
        expect(msngr.safe({ myprop: 15 }, "myprop")).to.equal(15);
        expect(msngr.safe({ yoyo: 15 }, "yar")).to.not.exist;
        expect(msngr.safe({ some: "stuff" }, "jdsfsdf", "really")).to.equal("really");
        expect(msngr.safe({ }, "xvxv")).to.not.exist;
        expect(msngr.safe({ }, "xvxv", "uhhuh")).to.equal("uhhuh");
    });

    it("msngr.safe() - Accesses a property at 1 depth successfully", function () {
        expect(msngr.safe({ myprop: { yoyo: 99 } }, "myprop.yoyo")).to.equal(99);
        expect(msngr.safe({ myprop: { yoyo: 99 } }, "myprop.chicken")).to.not.exist;
        expect(msngr.safe({ }, "myprop.chicken")).to.not.exist;
        expect(msngr.safe({ }, "myprop.chicken", "cool")).to.equal("cool");
    });

    it("msngr.safe() - Accesses a property at N depth successfully", function () {
        var obj = {
            something: {
                for: {
                    nothing: {
                        yoyo: {
                            are: {
                                fun: {
                                    toys: "yes!!"
                                }
                            }
                        }
                    }
                }
            }
        };
        expect(msngr.safe(obj, "something.for.nothing.yoyo.are.fun.toys")).to.equal("yes!!");
        expect(msngr.safe(obj, "something.for.nothing.sfjsldfj.are.fun.toys")).to.not.exist;
        expect(msngr.safe(obj, "something.for.nothing.sfjsldfj.are.fun.toys", "goofs")).to.equal("goofs");
    });

});
