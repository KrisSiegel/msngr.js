if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./mutators/asyncify.js", function () {
    "use strict";

    it("msngr.asyncify() - takes a normal, sync method and adds a .async() method onto it and properly returns a result", function (done) {
        var helloworld = function() {
            return "helloworld";
        };

        msngr.asyncify(helloworld);
        helloworld.async(function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.exist;
            expect(result).to.equal("helloworld");
            done();
        });
    });

    it("msngr.asyncify() - takes a normal, sync method and adds a .async() method onto it and properly returns an error", function (done) {
        var helloworld = function() {
            throw "helloworldexception";
        };

        msngr.asyncify(helloworld);
        helloworld.async(function(err, result) {
            expect(err).to.exist;
            expect(result).to.not.exist;
            expect(err).to.equal("helloworldexception");
            done();
        });
    });

});
