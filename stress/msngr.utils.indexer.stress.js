
module.exports = (function (done) {
    var benchmark = require("benchmark");

    var stress = (function (description, msngr, uniqueKey) {
        var suite = new benchmark.Suite;
        suite.add("index", function () {
            msngr.utils.indexer.index({
                topic: ("topic_" + uniqueKey)
            }, ("key_" + uniqueKey));
        });

        suite.add("query no wildcard", function () {
            msngr.utils.indexer.query({
                topic: "test"
            });
        });

        suite.add("query with wildcard", function () {
            msngr.utils.indexer.query({
                topic: "t*"
            });
        });

        suite.on("cycle", function (event) {
            console.log(String(event.target));
        });

        suite.run({ "async": false });

        done();
    });

    stress("msngr - 100,000 receiver registrations", require("../msngr.js"), Math.floor(Math.random() * 1000));
});
