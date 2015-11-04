if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./objects/net.js", function() {
    "use strict";
    var HOST_PROTOCOL = "http";
    var HOST_NAME = "localhost";
    var HOST_PORT = "8009";
    var server;

    it("msngr.net(protocol, host, port) - returns a web object when proper input is provided", function() {
        var net = msngr.net(HOST_PROTOCOL, HOST_NAME, HOST_PORT);
        expect(net).to.exist;
        expect(net.protocol).to.equal(HOST_PROTOCOL);
        expect(net.host).to.equal(HOST_NAME);
        expect(net.port).to.equal(HOST_PORT);
    });

    it("msngr.net(protocol, host) - returns a web object when only protocol and host are provided", function() {
        var net = msngr.net(HOST_PROTOCOL, HOST_NAME);
        expect(net).to.exist;
        expect(net.protocol).to.equal(HOST_PROTOCOL);
        expect(net.host).to.equal(HOST_NAME);
        expect(net.port).to.equal("80");
    });

    it("msngr.net(host) - returns a web object when a string including protocol, host and port are provided", function() {
        var net = msngr.net(HOST_PROTOCOL + "://" + HOST_NAME + ":" + HOST_PORT);
        expect(net).to.exist;
        expect(net.protocol).to.equal(HOST_PROTOCOL);
        expect(net.host).to.equal(HOST_NAME);
        expect(net.port).to.equal(HOST_PORT);
    });

    it("msngr.net(host) - returns a web object when a string including protocol and host are provided", function() {
        var net = msngr.net(HOST_PROTOCOL + "://" + HOST_NAME);
        expect(net).to.exist;
        expect(net.protocol).to.equal(HOST_PROTOCOL);
        expect(net.host).to.equal(HOST_NAME);
        expect(net.port).to.equal("80");
    });

    it("msngr.net(host) - returns a web object when a string including protocol and host are provided and extra path is stripped", function() {
        var net = msngr.net(HOST_PROTOCOL + "://" + HOST_NAME + "/crazy/stuff");
        expect(net).to.exist;
        expect(net.protocol).to.equal(HOST_PROTOCOL);
        expect(net.host).to.equal(HOST_NAME);
        expect(net.port).to.equal("80");
    });

    it("msngr.net(host) - returns a web object when a string including protocol, host and port are provided and extra path is stripped", function() {
        var net = msngr.net(HOST_PROTOCOL + "://" + HOST_NAME + ":" + HOST_PORT + "/crazy/stuff");
        expect(net).to.exist;
        expect(net.protocol).to.equal(HOST_PROTOCOL);
        expect(net.host).to.equal(HOST_NAME);
        expect(net.port).to.equal(HOST_PORT);
    });

    it("msngr.net(host) - returns a web object when a string only including host is provided", function() {
        var net = msngr.net(HOST_NAME);
        expect(net).to.exist;
        expect(net.protocol).to.equal("http");
        expect(net.host).to.equal(HOST_NAME);
        expect(net.port).to.equal("80");
    });

    it("msngr.net(protocol, host, port) - throws exception when presented with invalid input", function() {
        expect(msngr.net.bind(47)).to.throw;
        expect(msngr.net.bind({ })).to.throw;
        expect(msngr.net.bind([])).to.throw;
        expect(msngr.net.bind("")).to.throw;
        expect(msngr.net.bind("             ")).to.throw;
    });

    it("msngr.net(protocol, host, port).get(opts, callback) - creates a GET request and returns 200", function(done) {
        var net = msngr.net(HOST_PROTOCOL, HOST_NAME, HOST_PORT);
        net.get({
            path: "/"
        }, function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.exist;
            expect(result.path).to.equal("/");
            done();
        });
    });

    it("msngr.net(protocol, host, port).get(opts, callback) - creates a GET request with a query string and returns a 200", function(done) {
        var net = msngr.net(HOST_PROTOCOL, HOST_NAME, HOST_PORT);
        net.get({
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

    it("msngr.net(protocol, host, port).post(opts, callback) - creates a POST request and returns 200", function(done) {
        var net = msngr.net(HOST_PROTOCOL, HOST_NAME, HOST_PORT);
        net.post({
            path: "/"
        }, function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.exist;
            expect(result.path).to.equal("/");
            done();
        });
    });

    it("msngr.net(protocol, host, port).post(opts, callback) - creates a POST request with data and returns a 200", function(done) {
        var net = msngr.net(HOST_PROTOCOL, HOST_NAME, HOST_PORT);
        net.post({
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

    it("msngr.net(protocol, host, port).put(opts, callback) - creates a PUT request and returns 200", function(done) {
        var net = msngr.net(HOST_PROTOCOL, HOST_NAME, HOST_PORT);
        net.put({
            path: "/"
        }, function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.exist;
            expect(result.path).to.equal("/");
            done();
        });
    });

    it("msngr.net(protocol, host, port).delete(opts, callback) - creates a DELETE request and returns 200", function(done) {
        var net = msngr.net(HOST_PROTOCOL, HOST_NAME, HOST_PORT);
        net.delete({
            path: "/"
        }, function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.exist;
            expect(result.path).to.equal("/");
            done();
        });
    });
});
