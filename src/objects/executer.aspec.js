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


    it("msngr.internal.objects.executer(method, payload, context).execute(done) - executes and returns a result from a sync method", function(done) {
        var myFunc = function(payload, async) {
            return 15;
        };

        msngr.internal.objects.executer(myFunc, undefined, this).execute(function(result) {
            expect(result).to.exist;
            expect(result).to.equal(15);
            done();
        });
    });

    it("msngr.internal.objects.executer(method, payload, context).execute(done) - executes and returns a result from an async method", function(done) {
        var myFunc = function(payload, async) {
            var d = async();
            d(42);
        };

        msngr.internal.objects.executer(myFunc, undefined, this).execute(function(result) {
            expect(result).to.existl
            expect(result).to.equal(42);
            done();
        });
    });

    it("msngr.internal.objects.executer(method, payload, context).execute(done) - done is executed even with no methods", function(done) {
        msngr.internal.objects.executer([], undefined, this).execute(function(result) {
            expect(result).to.exist;
            expect(result.length).to.equal(0);
            done();
        });
    });

    it("msngr.internal.objects.executer(method, payload, context).parallel(done) - done is executed even with no methods", function(done) {
        msngr.internal.objects.executer([], undefined, this).parallel(function(result) {
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

        var executer = msngr.internal.objects.executer([func1, func2, func3, func4, func5, func6], {
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
        expect(msngr.executer([], {}, undefined).execute).to.exist;
        expect(msngr.executer([], {}, undefined).parallel).to.exist;
    });

});
