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

    msngr.debug = true;
    msngr.internal.reset();

    console.log("Benchmarks starting for executer object methods");
    bench.add("1x functions", {
        defer: true,
        fn: function(deferred) {
            var func = function() {
                return 42;
            };

            msngr.executer([func]).parallel(function() {
                deferred.resolve();
            });
        }
    });

    bench.on("cycle", function(event) {
        console.log(String(event.target));
        msngr.debug = true;
        msngr.internal.reset();
    });

    bench.on("complete", function() {
        console.log("Benchmarks complete for executer object methods");
        msngr.debug = false;
        done(null);
    });

    bench.run({ 'async': true });
});
