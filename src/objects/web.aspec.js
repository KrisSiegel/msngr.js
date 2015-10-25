if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./objects/web.js", function() {
    "use strict";
    var HOST_PROTOCOL = "http";
    var HOST_NAME = "localhost";
    var HOST_PORT = "8009";
    var server;

    it("msngr.web(protocol, host, port) - returns a web object when proper input is provided", function() {
        var web = msngr.web(HOST_PROTOCOL, HOST_NAME, HOST_PORT);
        expect(web).to.exist;
        expect(web.protocol).to.equal(HOST_PROTOCOL);
        expect(web.host).to.equal(HOST_NAME);
        expect(web.port).to.equal(HOST_PORT);
    });

    it("msngr.web(protocol, host) - returns a web object when only protocol and host are provided", function() {
        var web = msngr.web(HOST_PROTOCOL, HOST_NAME);
        expect(web).to.exist;
        expect(web.protocol).to.equal(HOST_PROTOCOL);
        expect(web.host).to.equal(HOST_NAME);
        expect(web.port).to.equal("80");
    });

    it("msngr.web(host) - returns a web object when a string including protocol, host and port are provided", function() {
        var web = msngr.web(HOST_PROTOCOL + "://" + HOST_NAME + ":" + HOST_PORT);
        expect(web).to.exist;
        expect(web.protocol).to.equal(HOST_PROTOCOL);
        expect(web.host).to.equal(HOST_NAME);
        expect(web.port).to.equal(HOST_PORT);
    });

    it("msngr.web(host) - returns a web object when a string including protocol and host are provided", function() {
        var web = msngr.web(HOST_PROTOCOL + "://" + HOST_NAME);
        expect(web).to.exist;
        expect(web.protocol).to.equal(HOST_PROTOCOL);
        expect(web.host).to.equal(HOST_NAME);
        expect(web.port).to.equal("80");
    });

    it("msngr.web(host) - returns a web object when a string including protocol and host are provided and extra path is stripped", function() {
        var web = msngr.web(HOST_PROTOCOL + "://" + HOST_NAME + "/crazy/stuff");
        expect(web).to.exist;
        expect(web.protocol).to.equal(HOST_PROTOCOL);
        expect(web.host).to.equal(HOST_NAME);
        expect(web.port).to.equal("80");
    });

    it("msngr.web(host) - returns a web object when a string including protocol, host and port are provided and extra path is stripped", function() {
        var web = msngr.web(HOST_PROTOCOL + "://" + HOST_NAME + ":" + HOST_PORT + "/crazy/stuff");
        expect(web).to.exist;
        expect(web.protocol).to.equal(HOST_PROTOCOL);
        expect(web.host).to.equal(HOST_NAME);
        expect(web.port).to.equal(HOST_PORT);
    });

    it("msngr.web(host) - returns a web object when a string only including host is provided", function() {
        var web = msngr.web(HOST_NAME);
        expect(web).to.exist;
        expect(web.protocol).to.equal("http");
        expect(web.host).to.equal(HOST_NAME);
        expect(web.port).to.equal("80");
    });

    it("msngr.web(protocol, host, port) - throws exception when presented with invalid input", function() {
        expect(msngr.web.bind(47)).to.throw;
        expect(msngr.web.bind({ })).to.throw;
        expect(msngr.web.bind([])).to.throw;
        expect(msngr.web.bind("")).to.throw;
        expect(msngr.web.bind("             ")).to.throw;
    });

    it("msngr.web(protocol, host, port).get(opts, callback) - creates a GET request and returns data", function(done) {
        var web = msngr.web(HOST_PROTOCOL, HOST_NAME, HOST_PORT);
        web.get({
            path: "/"
        }, function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.exist;
            
            done();
        });
    });
});
