
module.exports = (function (done) {
    var stress = (function (description, msngr, uniqueKey, end) {
        console.time(description);

        var i = 0;
        while (i < 1000) {
            msngr.receive({
                topic: "test" + uniqueKey + i
            }, function () {

            }, this);

            msngr.sendSync("test" + uniqueKey + i);
            i++;
        }

        console.timeEnd(description);
        end();
    });

    stress("[Concatenated] msngr - 1,000 sendSync and receive", require("../msngr.js"), Math.floor(Math.random() * 1000), function () {
        stress("[Minified] msngr - 1,000 sendSync and receive", require("../msngr.min.js"), Math.floor(Math.random() * 1000), function () {
            done();
        });
    });
});
