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

    it("msngr.extend(func, target) - extends a method with properties", function () {
        var myTest = function () {
            return 15;
        };

        var func2 = function (external, internal) {
            expect(external).to.exist;
            expect(internal).to.exist;

            return {
                val: 12
            };
        };

        msngr.extend(func2, myTest);

        expect(myTest.val).to.exist;
        expect(myTest.val).to.equal(12);
        expect(myTest()).to.equal(15);
    });

    it("msngr.extend(undefined, target) - extending undefined value is simply ignored", function () {
        var myTest = { };
        msngr.extend(undefined, myTest);

        expect(myTest).to.exist;
        expect(Object.keys(myTest).length).to.equal(0);
    });

    it("msngr.debug - property setting exports internal object for testing and debugging", function () {
        msngr.debug = false;
        expect(msngr.internal).to.not.exist;
        expect(msngr.debug).to.equal(false);
        msngr.debug = true;
        expect(msngr.internal).to.exist;
        expect(msngr.debug).to.equal(true);
        msngr.debug = false;
        expect(msngr.internal).to.not.exist;
    });

    it("msngr.warnings - can set the property to true or false", function () {
        expect(msngr.warnings).to.equal(true);
        msngr.warnings = false;
        expect(msngr.warnings).to.equal(false);
    });
});
