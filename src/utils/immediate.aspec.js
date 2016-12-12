if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./utils/immediate.js", function () {
    "use strict";

    it("msngr.immediate() - single, works just like setTimeout(fn, 0) / setImmediate(fn)", function(done) {
        msngr.immediate(function() {
            done();
        });
    });

    it("msngr.immediate() - nested, works just like setTimeout(fn, 0) / setImmediate(fn)", function(done) {
        msngr.immediate(function() {
          msngr.immediate(function() {
            msngr.immediate(function() {
              msngr.immediate(function() {
                msngr.immediate(function() {
                  msngr.immediate(function() {
                    msngr.immediate(function() {
                      msngr.immediate(function() {
                        msngr.immediate(function() {
                          msngr.immediate(function() {
                            msngr.immediate(function() {
                              msngr.immediate(function() {
                                msngr.immediate(function() {
                                    done();
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
    });

});
