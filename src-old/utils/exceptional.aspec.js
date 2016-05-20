if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./utils/exceptional.js", function() {
    "use strict";

    before(function() {
        msngr.debug = true;
    });

    after(function() {
        msngr.debug = false;
    });

    it("internal.InvalidParametersException(str) - throws an exception", function() {
        var myfunc = function() {
            throw internal.InvalidParametersException("MyParameter");
        };

        expect(myfunc).to.throw();
    });

    it("internal.InvalidParametersException(str, reason) - throws an exception", function() {
        var myfunc = function() {
            throw internal.InvalidParametersException("MyParameter", "A real reason");
        };

        expect(myfunc).to.throw();
    });

    it("internal.ReservedKeywordsException(keyword) - throws an exception", function() {
        var myfunc = function() {
            throw internal.ReservedKeywordsException("MyKeyword");
        };

        expect(myfunc).to.throw();
    });

    it("internal.MangledException(variable, method) - throws an exception", function() {
        var myfunc = function() {
            throw internal.MangledException("MyVariable", "MyFunc");
        };

        expect(myfunc).to.throw();
    });

});
