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

    it("msngr.web(protocol, host, port).get(opts, callback) - creates a GET request and returns 200", function(done) {
        var web = msngr.web(HOST_PROTOCOL, HOST_NAME, HOST_PORT);
        web.get({
            path: "/"
        }, function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.exist;
            expect(result.path).to.equal("/");
            done();
        });
    });

    it("msngr.web(protocol, host, port).get(opts, callback) - creates a GET request with a query string and returns a 200", function(done) {
        var web = msngr.web(HOST_PROTOCOL, HOST_NAME, HOST_PORT);
        web.get({
            path: "/search",
            query: {
                term: "search topic"
            }
        }, function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.exist;
            expect(result.path).to.equal("/search?term=search%20topic");
            done();
        });
    });

    it("msngr.web(protocol, host, port).post(opts, callback) - creates a POST request and returns 200", function(done) {
        var web = msngr.web(HOST_PROTOCOL, HOST_NAME, HOST_PORT);
        web.post({
            path: "/"
        }, function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.exist;
            expect(result.path).to.equal("/");
            done();
        });
    });

    it("msngr.web(protocol, host, port).post(opts, callback) - creates a POST request with data and returns a 200", function(done) {
        var web = msngr.web(HOST_PROTOCOL, HOST_NAME, HOST_PORT);
        web.post({
            path: "/users",
            payload: {
                username: "kris",
                email: "redacted@redacted.com"
            }
        }, function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.exist;
            expect(result.path).to.equal("/users");
            result.body = JSON.parse(result.body);
            expect(result.body.username).to.equal("kris");
            expect(result.body.email).to.equal("redacted@redacted.com");
            done();
        });
    });

    it("msngr.web(protocol, host, port).put(opts, callback) - creates a PUT request and returns 200", function(done) {
        var web = msngr.web(HOST_PROTOCOL, HOST_NAME, HOST_PORT);
        web.put({
            path: "/"
        }, function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.exist;
            expect(result.path).to.equal("/");
            done();
        });
    });

    it("msngr.web(protocol, host, port).delete(opts, callback) - creates a DELETE request and returns 200", function(done) {
        var web = msngr.web(HOST_PROTOCOL, HOST_NAME, HOST_PORT);
        web.delete({
            path: "/"
        }, function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.exist;
            expect(result.path).to.equal("/");
            done();
        });
    });
});
