if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./utils/web.js", function() {
    "use strict";
    var HOST_PROTOCOL = "http";
    var HOST_NAME = "127.0.0.1";
    var HOST_PORT = "8009";
    var HOST_FULL = HOST_NAME + ":" + HOST_PORT;
    var server;

    it("msngr.web(hostname) - returns a set of methods when a string is passed in", function() {
        var web = msngr.web(HOST_FULL);
        expect(web).to.exist;
        expect(web.get).to.exist;
        expect(web.post).to.exist;
        expect(web.put).to.exist;
        expect(web.delete).to.exist;
    });

    it("msngr.web(hostname) - correctly throws when invalid input is passed in", function() {
        expect(msngr.web.bind(undefined)).to.throw();
        expect(msngr.web.bind(null)).to.throw();
        expect(msngr.web.bind({ })).to.throw();
        expect(msngr.web.bind(42)).to.throw();
        expect(msngr.web.bind("")).to.throw();
        expect(msngr.web.bind("         ")).to.throw();
    });

    it("msngr.web(hostname).get(path) - correctly hits and received a response from a GET request", function(done) {
        var web = msngr.web(HOST_FULL);
        web.get("/test", function (err, result) {
            console.log(result);
            done();
        });
    });
});
