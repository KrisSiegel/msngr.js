
var stress = (function (description, msngr, uniqueKey) {
    console.time(description);

    msngr.receive({topic: "test"}, function () { console.log("test"); });
    msngr.send({topic: "test"});

    console.timeEnd(description);
});

stress("[Concatenated] msngr - 10,000 send and receive", require("../msngr.js"), Math.floor(Math.random() * 1000));
//stress("[Minified] msngr - 10,000 send and receive", require("../msngr.min.js"), Math.floor(Math.random() * 1000));
