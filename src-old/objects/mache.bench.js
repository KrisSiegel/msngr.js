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

    var mache = msngr.mache();

    console.log("Benchmarks starting for mache object methods");
    bench.add("Setting string values into mache", {
        defer: true,
        fn: function(deferred) {
            mache.set("mykey", "myvalue");
            deferred.resolve();
        }
    });

    bench.add("Setting object values into mache", {
        defer: true,
        fn: function(deferred) {
            mache.set("mykey", {
                val: "testering"
            });
            deferred.resolve();
        }
    });

    bench.on("cycle", function(event) {
        console.log(String(event.target));
        mache = msngr.mache();
    });

    bench.on("complete", function() {
        console.log("Benchmarks complete for mache object methods");
        msngr.debug = false;
        done(null);
    });

    bench.run({ 'async': true });
});
