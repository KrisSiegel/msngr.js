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

    it("msngr.is() - expect is() method to exist", function () {
        expect(msngr.is).to.exist;
    });

    it("msngr.is(args...).arguments - expects a correct result for arguments testing", function () {
        (function () { expect(msngr.is(arguments).arguments).to.equal(true); }(1, 2, 3));
        expect(msngr.is("testing").arguments).to.equal(false);
        expect(msngr.is([]).arguments).to.equal(false);
        expect(msngr.is({}).arguments).to.equal(false);
        expect(msngr.is(12).arguments).to.equal(false);
        expect(msngr.is(new Date()).arguments).to.equal(false);
        expect(msngr.is(function () {}).arguments).to.equal(false);

        if (typeof Symbol !== "undefined") {
            expect(msngr.is(Symbol()).arguments).to.equal(false);
        }

        if (typeof Promise !== "undefined") {
            expect(msngr.is(new Promise(function (resolve) { resolve(); })).arguments).to.equal(false);
        }
    });

    it("msngr.is(bool...).boolean - expects a correct result for boolean testing", function () {
        (function () { expect(msngr.is(arguments).boolean).to.equal(false); }(1, 2, 3));
        expect(msngr.is("testing").boolean).to.equal(false);
        expect(msngr.is([]).boolean).to.equal(false);
        expect(msngr.is({}).boolean).to.equal(false);
        expect(msngr.is(12).boolean).to.equal(false);
        expect(msngr.is(new Date()).boolean).to.equal(false);
        expect(msngr.is(function () {}).boolean).to.equal(false);
        expect(msngr.is(true).boolean).to.equal(true);
        expect(msngr.is(false).boolean).to.equal(true);

        if (typeof Symbol !== "undefined") {
            expect(msngr.is(Symbol()).boolean).to.equal(false);
        }

        if (typeof Promise !== "undefined") {
            expect(msngr.is(new Promise(function (resolve) { resolve(); })).boolean).to.equal(false);
        }
    });

    it("msngr.is(str...).string - expects a correct result for string testing", function () {
        (function () { expect(msngr.is(arguments).string).to.equal(false); }(1, 2, 3));
        expect(msngr.is("testing").string).to.equal(true);
        expect(msngr.is("testing", "weee", "yup").string).to.equal(true);
        expect(msngr.is("testing", "weee", 42).string).to.equal(false);
        expect(msngr.is([]).string).to.equal(false);
        expect(msngr.is({}).string).to.equal(false);
        expect(msngr.is(12).string).to.equal(false);
        expect(msngr.is(new Date()).string).to.equal(false);
        expect(msngr.is(function () {}).string).to.equal(false);

        if (typeof Symbol !== "undefined") {
            expect(msngr.is(Symbol()).string).to.equal(false);
        }

        if (typeof Promise !== "undefined") {
            expect(msngr.is(new Promise(function (resolve) { resolve(); })).string).to.equal(false);
        }
    });

    it("msngr.is(date...).date - expects a correct result for date testing", function () {
        (function () { expect(msngr.is(arguments).date).to.equal(false); }(1, 2, 3));
        expect(msngr.is("testing").date).to.equal(false);
        expect(msngr.is([]).date).to.equal(false);
        expect(msngr.is({}).date).to.equal(false);
        expect(msngr.is(12).date).to.equal(false);
        expect(msngr.is(new Date()).date).to.equal(true);
        expect(msngr.is(new Date(), new Date(), new Date()).date).to.equal(true);
        expect(msngr.is(new Date(), new Date(), 42).date).to.equal(false);
        expect(msngr.is(function () {}).date).to.equal(false);

        if (typeof Symbol !== "undefined") {
            expect(msngr.is(Symbol()).date).to.equal(false);
        }

        if (typeof Promise !== "undefined") {
            expect(msngr.is(new Promise(function (resolve) { resolve(); })).date).to.equal(false);
        }
    });

    it("msngr.is(arr...).array - expects a correct result for array testing", function () {
        (function () { expect(msngr.is(arguments).array).to.equal(false); }(1, 2, 3));
        expect(msngr.is("testing").array).to.equal(false);
        expect(msngr.is([]).array).to.equal(true);
        expect(msngr.is([], []).array).to.equal(true);
        expect(msngr.is([], [], "greenbeans").array).to.equal(false);
        expect(msngr.is({}).array).to.equal(false);
        expect(msngr.is(12).array).to.equal(false);
        expect(msngr.is(new Date()).array).to.equal(false);
        expect(msngr.is(function () {}).array).to.equal(false);

        if (typeof Symbol !== "undefined") {
            expect(msngr.is(Symbol()).array).to.equal(false);
        }

        if (typeof Promise !== "undefined") {
            expect(msngr.is(new Promise(function (resolve) { resolve(); })).array).to.equal(false);
        }
    });

    it("msngr.is(num...).function - expects a correct result for number testing", function () {
        (function () { expect(msngr.is(arguments).number).to.equal(false); }(1, 2, 3));
        expect(msngr.is("testing").number).to.equal(false);
        expect(msngr.is([]).number).to.equal(false);
        expect(msngr.is({}).number).to.equal(false);
        expect(msngr.is(12).number).to.equal(true);
        expect(msngr.is(12, 45, 234).number).to.equal(true);
        expect(msngr.is(12, 12, "stuff").number).to.equal(false);
        expect(msngr.is(new Date()).number).to.equal(false);
        expect(msngr.is(function () {}).number).to.equal(false);

        if (typeof Symbol !== "undefined") {
            expect(msngr.is(Symbol()).number).to.equal(false);
        }

        if (typeof Promise !== "undefined") {
            expect(msngr.is(new Promise(function (resolve) { resolve(); })).number).to.equal(false);
        }
    });

    it("msngr.is(obj...).object - expects a correct result for object testing", function () {
        (function () { expect(msngr.is(arguments).object).to.equal(false); }(1, 2, 3));
        expect(msngr.is("testing").object).to.equal(false);
        expect(msngr.is([]).object).to.equal(false);
        expect(msngr.is({}).object).to.equal(true);
        expect(msngr.is({}, {}, {}).object).to.equal(true);
        expect(msngr.is({}, "test", {}).object).to.equal(false);
        expect(msngr.is(12).object).to.equal(false);
        expect(msngr.is(new Date()).object).to.equal(false);
        expect(msngr.is(function () {}).object).to.equal(false);

        if (typeof Symbol !== "undefined") {
            expect(msngr.is(Symbol()).object).to.equal(false);
        }
    });

    it("msngr.is(func...).function - expects a correct result for function testing", function () {
        (function () { expect(msngr.is(arguments).function).to.equal(false); }(1, 2, 3));
        expect(msngr.is("testing").function).to.equal(false);
        expect(msngr.is([]).function).to.equal(false);
        expect(msngr.is({}).function).to.equal(false);
        expect(msngr.is(12).function).to.equal(false);
        expect(msngr.is(new Date()).function).to.equal(false);
        expect(msngr.is(function () {}).function).to.equal(true);
        expect(msngr.is(function () {}, function () {}).function).to.equal(true);
        expect(msngr.is(function () {}, 123, function () {}).function).to.equal(false);

        if (typeof Symbol !== "undefined") {
            expect(msngr.is(Symbol()).function).to.equal(false);
        }

        if (typeof Promise !== "undefined") {
            expect(msngr.is(new Promise(function (resolve) { resolve(); })).function).to.equal(false);
        }
    });

    // Verify we can even test the Symbol first otherwise ignore it
    if (typeof Symbol !== "undefined") {
        it("msngr.is(symb...).symbol - expects a correct result for symbol testing", function () {
            (function () { expect(msngr.is(arguments).symbol).to.equal(false); }(1, 2, 3));
            expect(msngr.is("testing").symbol).to.equal(false);
            expect(msngr.is([]).symbol).to.equal(false);
            expect(msngr.is({}).symbol).to.equal(false);
            expect(msngr.is(12).symbol).to.equal(false);
            expect(msngr.is(new Date()).symbol).to.equal(false);
            expect(msngr.is(function () {}).symbol).to.equal(false);

            expect(msngr.is(Symbol()).symbol).to.equal(true);
            expect(msngr.is(Symbol(), Symbol()).symbol).to.equal(true);
            expect(msngr.is(Symbol(), 15, Symbol()).symbol).to.equal(false);

            if (typeof Promise !== "undefined") {
                expect(msngr.is(new Promise(function (resolve) { resolve(); })).symbol).to.equal(false);
            }
        });
    }

    it("msngr.is(obj...).getType() - expects a type to be returned for the first item", function () {
        expect(msngr.is("sdad").getType()).to.equal("[object String]");
        expect(msngr.is(5).getType()).to.equal("[object Number]");
    });

    it("msngr.is(obj...).getTypes() - expects a type to be returned for all items", function () {
        expect(msngr.is("sdad", 5, new Date()).getTypes()).to.deep.equal(["[object String]", "[object Number]", "[object Date]"]);
    });

    it("msngr.is(obj...).there - expects to handle existance correctly with the 'there' property", function () {
        expect(msngr.is(undefined).there).to.equal(false);
        expect(msngr.is(null).there).to.equal(false);
        expect(msngr.is({}, undefined).there).to.equal(false);
        expect(msngr.is({}, null).there).to.equal(false);
        expect(msngr.is("").there).to.equal(true);
        expect(msngr.is(4).there).to.equal(true);
        expect(msngr.is(true).there).to.equal(true);
        expect(msngr.is(false).there).to.equal(true);
        expect(msngr.is(new Date()).there).to.equal(true);
        expect(msngr.is(function () {}).there).to.equal(true);
    });

    it("msngr.is(obj...).empty - expects to handle empty inputs correctly", function () {
        expect(msngr.is("").empty).to.equal(true);
        expect(msngr.is("    ").empty).to.equal(true);
        expect(msngr.is("        ").empty).to.equal(true);
        expect(msngr.is("sdlfjsdlkfjlsf").empty).to.equal(false);
        expect(msngr.is(undefined).empty).to.equal(true);
        expect(msngr.is(null).empty).to.equal(true);
        expect(msngr.is({ }).empty).to.equal(true);
        expect(msngr.is([]).empty).to.equal(true);
        expect(msngr.is({ something: 1 }).empty).to.equal(false);
        expect(msngr.is([1,2,3]).empty).to.equal(false);

        expect(msngr.is("", "       ", { }).empty).to.equal(true);
        expect(msngr.is("", "some").empty).to.equal(false);
        expect(msngr.is("sgsdfgfsd", "").empty).to.equal(false);
    });

});
