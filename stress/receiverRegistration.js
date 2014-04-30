
var stress = (function (description, msngr, uniqueKey) {
    console.time(description);

    var i = 0;
    while (i < 10000) {
        msngr.receive({
            topic: "test_" + uniqueKey + "_" + i
        }, function () { });
        i++;
    }

    console.timeEnd(description);
});

stress("[Concatenated] msngr - 10,000 receiver registrations", require("../msngr.js"), Math.floor(Math.random() * 1000));
stress("[Minified] msngr - 10,000 receiver registrations", require("../msngr.min.js"), Math.floor(Math.random() * 1000));
