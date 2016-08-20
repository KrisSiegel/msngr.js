if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./src/messaging/executer.js", function () {
    "use strict";

    before(function() {
        msngr.debug = true;
    });

    after(function() {
        msngr.debug = false;
    });

    it("msngr.internal.executer(methodsAndParams, context).parallel(done) - done is executed even with no methods", function (done) {
        msngr.internal.executer([]).parallel(function(result) {
            expect(result).to.exist;
            expect(result.length).to.equal(0);
            done();
        });
    });

    it("msngr.internal.executer(methods, payload, context).parallel(done) - executes multiple methods and aggregates results", function (done) {
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

        var executer = msngr.internal.executer([makeObj(func1), makeObj(func2), makeObj(func3), makeObj(func4), makeObj(func5), makeObj(func6)], {
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

    it("msngr.internal.executer(funcs).parallel() - With no parameters specified async is the first parameter", function (done) {
        var executer = msngr.internal.executer([
            function (async) {
                expect(async).to.exist;
                expect(msngr.is(async).function).to.equal(true);
            }
        ]).parallel(function () {
            done();
        });
    });

    it("msngr.internal.executer(funcs).series() - Executes methods in a series", function (done) {
        var executer = msngr.internal.executer([
            function (async) {
                return "a";
            },
            function (async) {
                var d = async();
                d("b");
            },
            function (async) {
                return "c";
            },
            function (async) {
                var d = async();
                d("d");
            },
            function (async) {
                return "e";
            }
        ]).series(function (results) {
            expect(results).to.exist;
            expect(results.length).to.equal(5);
            expect(results.join("")).to.equal("abcde");
            done();
        });
    });
});
