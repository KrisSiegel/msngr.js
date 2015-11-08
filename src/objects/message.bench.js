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

    console.log("Benchmarks starting for message object methods");
    bench.add("1x registrations + 1x emits", {
        defer: true,
        fn: function(deferred) {
            var msg = msngr("Topic1", "Category1", "Subcategory1");
            msg.on(function(payload, message) {
                msg.dropAll();
                deferred.resolve();
            });
            msg.emit("value");
        }
    });

    bench.add("3x registrations + 1x emits", {
        defer: true,
        fn: function(deferred) {
            var msg = msngr("Topic1", "Category1", "Subcategory1");
            msg.on(function(payload, message) {
                return 1 + 1;
            });
            msg.on(function(payload, message) {
                return 1 + 1;
            });
            msg.on(function(payload, message) {
                return 1 + 1;
            });
            msg.emit("value", function(result) {
                msg.dropAll();
                deferred.resolve();
            });
        }
    });

    bench.add("1x registrations + 1x persists", {
        defer: true,
        fn: function(deferred) {
            var msg = msngr("Topic1", "Category1", "Subcategory1");
            msg.on(function(payload, message) {
                msg.dropAll();
                msg.cease();
                deferred.resolve();
            });
            msg.persist("value");
        }
    });

    bench.on("cycle", function(event) {
        console.log(String(event.target));
        msngr.internal.reset();
    });

    bench.on("complete", function() {
        console.log("Benchmarks complete for message object methods");
        msngr.debug = false;
        done(null);
    });

    bench.run({ 'async': true });
});
