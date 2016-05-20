if (typeof chai === "undefined" && typeof window === "undefined") {
    var benchmark = require("benchmark");
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

var exporter;
if (msngr.isBrowser()) {
    window.benchmarkers = window.benchmarkers || [];
    exporter = function(fn) {
        window.benchmarkers.push(fn);
    };
} else {
    exporter = function(fn) {
        module.exports = fn;
    };
}

exporter(function(done) {
    "use strict";
    var bench = new benchmark.Suite;

    console.log("Benchmarks starting for misc utils methods");
    bench.add("1x immediate()", {
        defer: true,
        fn: function(deferred) {
            msngr.immediate(function() {
                deferred.resolve();
            });
        }
    });

    bench.on("cycle", function(event) {
        console.log(String(event.target));
    });

    bench.on("complete", function() {
        console.log("Benchmarks complete for misc utils methods");
        done(null);
    });

    bench.run({ 'async': true });
});
