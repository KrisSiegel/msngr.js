if (typeof chai === "undefined" && typeof window === "undefined") {
    var benchmark = require("benchmark");
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

var exporter;
if (msngr.is.browser) {
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
    var memory = msngr.internal.memory();

    console.log("Benchmarks starting for memory object methods");
    bench.add("Indexing messages containing only topics", {
        defer: true,
        fn: function(deferred) {
            memory.index({
                topic: "MyTopic"
            });
            deferred.resolve();
        }
    });

    bench.add("Indexing messages containing topics and categories", {
        defer: true,
        fn: function(deferred) {
            memory.index({
                topic: "MyTopic",
                category: "MyCategory"
            });
            deferred.resolve();
        }
    });

    bench.add("Indexing messages containing topics, categories and subcategories", {
        defer: true,
        fn: function(deferred) {
            memory.index({
                topic: "MyTopic",
                category: "MyCategory",
                subcategory: "MySubcategory"
            });
            deferred.resolve();
        }
    });

    bench.add("Indexing + Querying messages containing only topics", {
        defer: true,
        fn: function(deferred) {
            memory.index({
                topic: "MyTopic"
            });
            memory.query({
                topic: "MyTopic"
            });
            deferred.resolve();
        }
    });

    bench.add("Indexing + Querying messages containing topics and categories", {
        defer: true,
        fn: function(deferred) {
            memory.index({
                topic: "MyTopic",
                category: "MyCategory"
            });
            memory.query({
                topic: "MyTopic",
                category: "MyCategory"
            });
            deferred.resolve();
        }
    });

    bench.add("Indexing + Querying messages containing topics, categories and subcategories", {
        defer: true,
        fn: function(deferred) {
            memory.index({
                topic: "MyTopic",
                category: "MyCategory",
                subcategory: "MySubcategory"
            });
            memory.query({
                topic: "MyTopic",
                category: "MyCategory",
                subcategory: "MySubcategory"
            });
            deferred.resolve();
        }
    });

    bench.on("cycle", function(event) {
        console.log(String(event.target));
        memory = msngr.internal.memory();
    });

    bench.on("complete", function() {
        console.log("Benchmarks complete for memory object methods");
        msngr.debug = false;
        done(null);
    });

    bench.run({ 'async': true });
});
