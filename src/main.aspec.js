if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../msngr");
}

describe("./main.js", function () {
    "use strict";

    it("msngr - expect object to exist", function () {
        expect(msngr).to.exist;
    });

    it("msngr.extend(obj, target) - expect method to exist", function () {
        expect(msngr.extend).to.exist;
    });

    it("msngr.extend(obj, target) - merges arrays from obj and target", function () {
        var obj1 = { test: [1, 2] };
        var obj2 = { test: [3, 4] };

        msngr.extend(obj1, obj2);

        expect(obj2.test).to.exist;
        expect(obj2.test.length).to.equal(4);
    });

    it("msngr.extend(obj, target) - expect properties to merge from obj and target", function () {
        var obj1 = { prop: "something" };
        var obj2 = { some: "thing" };

        msngr.extend(obj1, obj2);

        expect(obj2.some).to.exist;
        expect(obj2.prop).to.exist;
        expect(obj2.prop).to.equal("something");
    });

    it("msngr.extend(obj, target) - expect deeply nested methods to merge from obj and target", function () {
        var obj1 = {
            this: {
                is: {
                    a: {
                        test: {
                            yup: function () { return "yup!"; }
                        }
                    }
                }
            }
        };

        var obj2 = {
            whatever: function () { return "whatever"; }
        };

        msngr.extend(obj1, obj2);

        expect(obj2.whatever).to.exist;
        expect(obj2.whatever()).to.equal("whatever");

        expect(obj2.this).to.exist;
        expect(obj2.this.is).to.exist;
        expect(obj2.this.is.a).to.exist;
        expect(obj2.this.is.a.test).to.exist;
        expect(obj2.this.is.a.test.yup).to.exist;
        expect(obj2.this.is.a.test.yup()).to.equal("yup!");
    });
});
