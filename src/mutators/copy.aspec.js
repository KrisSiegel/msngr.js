if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./mutators/copy.js", function () {
    "use strict";

    it("msngr.copy() - expect copy() method to exist", function () {
        expect(msngr.copy).to.exist;
    });

    it("msngr.copy() - expect copy to correctly handle immutable inputs", function () {
        var str = "testing";
        var strCopy = msngr.copy(str);
        expect(strCopy).to.equal(str);
        str = "not testing";
        expect(strCopy).to.not.equal(str);

        var num = 47;
        var numCopy = msngr.copy(num);
        expect(numCopy).to.equal(num);
        num = 42;
        expect(numCopy).to.not.equal(num);

        var bool = true;
        var boolCopy = msngr.copy(bool);
        expect(boolCopy).to.equal(bool);
        bool = false;
        expect(boolCopy).to.not.equal(bool);
    });

    it("msngr.copy() - expect copy to correctly handle an object input", function () {
        var obj1 = {
            this: {
                is: {
                    a: {
                        test: true
                    }
                }
            }
        };

        var obj1Copy = msngr.copy(obj1);
        expect(obj1Copy).to.deep.equal(obj1);

        obj1["another"] = false;
        expect(obj1Copy).to.not.deep.equal(obj1);
    });

    it("msngr.copy() - expect copy to correctly handle a function input", function () {
        var fn = function () { };
        fn.test = "yeah";

        var fnCopy = msngr.copy(fn);
        expect(fn.test).to.equal(fnCopy.test);
        fn.testing = true;
        expect(fn.testing).to.not.equal(fnCopy.testing);
    });

    it("msngr.copy() - expect copy to correctly handle an array input", function () {
        var arr = [1, 4, "to", true];
        var arrCopy = msngr.copy(arr);

        expect(arrCopy).to.deep.equal(arr);
        arr.shift();
        expect(arrCopy).to.not.deep.equal(arr);
    });

    it("msngr.copy() - expect copy to correctly handle a date input", function () {
        var d = new Date();
        var dCopy = msngr.copy(d);

        expect(d.getTime()).to.equal(dCopy.getTime());
        d.setHours(d.getHours() + 1);
        expect(d.getTime()).to.not.equal(dCopy.getTime());
    });

});
