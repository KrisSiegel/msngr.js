if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./objects/executer.js", function() {
    "use strict";

    before(function() {
        msngr.debug = true;
    });

    after(function() {
        msngr.debug = false;
    });

    it("msngr.internal.objects.executer(methodsAndParams, context).parallel(done) - done is executed even with no methods", function(done) {
        msngr.internal.objects.executer([]).parallel(function(result) {
            expect(result).to.exist;
            expect(result.length).to.equal(0);
            done();
        });
    });

    it("msngr.internal.objects.executer(methods, payload, context).parallel(done) - executes multiple methods and aggregates results", function(done) {
        var func1 = function(payload, async) {
            expect(payload.t).to.exist;
            expect(payload.t).to.equal(false);
            return 1;
        }

        var func2 = function(payload, async) {
            expect(payload.t).to.exist;
            expect(payload.t).to.equal(false);
            return "test";
        }

        var func3 = function(payload, async) {
            expect(payload.t).to.exist;
            expect(payload.t).to.equal(false);
            var d = async();
            d("whatever!");
        }

        var func4 = function(payload, async) {
            expect(payload.t).to.exist;
            expect(payload.t).to.equal(false);
            return 97;
        }

        var func5 = function(payload, async) {
            expect(payload.t).to.exist;
            expect(payload.t).to.equal(false);
            return 100;
        }

        var func6 = function(payload, async) {
            expect(payload.t).to.exist;
            expect(payload.t).to.equal(false);
            return true;
        }

        var makeObj = function(fn) {
            return {
                method: fn,
                params: [{ t: false }]
            };
        }

        var executer = msngr.internal.objects.executer([makeObj(func1), makeObj(func2), makeObj(func3), makeObj(func4), makeObj(func5), makeObj(func6)], {
            t: false
        }, this);
        executer.parallel(function(results) {
            expect(results).to.exist;
            expect(results.length).to.equal(6);
            expect(results.indexOf(1)).to.not.equal(-1);
            expect(results.indexOf("test")).to.not.equal(-1);
            expect(results.indexOf("whatever!")).to.not.equal(-1);
            expect(results.indexOf(97)).to.not.equal(-1);
            expect(results.indexOf(100)).to.not.equal(-1);
            expect(results.indexOf(true)).to.not.equal(-1);

            done();
        });
    });

    it("msngr.executer(methods, payload, context) - executer is exposed for anyone to access", function() {
        expect(msngr.executer).to.exist;
        expect(msngr.executer([], {}, undefined)).to.exist;
        expect(msngr.executer([], {}, undefined).parallel).to.exist;
    });

});
