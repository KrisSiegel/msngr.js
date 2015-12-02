if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./options/dom.js", function() {
    "use strict";

    before(function() {
        msngr.debug = true;
    });

    beforeEach(function() {
        msngr.internal.reset();
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    after(function() {
        msngr.debug = false;
    });

    it("dom option - gathers multiple values with a selector that matches multiple elements with no IDs or names", function(done) {
        var input1 = document.createElement("input");
        input1.value = "Kris";

        var input2 = document.createElement("input");
        input2.value = "AnEmail@Address.here";

        document.body.appendChild(input1);
        document.body.appendChild(input2);

        msngr("TestTopic").on(function(payload) {
            expect(payload).to.exist;
            expect(payload["input0"]).to.exist;
            expect(payload["input0"]).to.equal("Kris");
            expect(payload["input1"]).to.exist;
            expect(payload["input1"]).to.equal("AnEmail@Address.here");

            document.body.removeChild(input1);
            document.body.removeChild(input2);

            done();
        });

        msngr("TestTopic").option("dom", ["input"]).emit();
    });

    it("dom action - gathers multiple values with a selector that matches multiple elements", function(done) {
        var input1 = document.createElement("input");
        input1.setAttribute("name", "Name");
        input1.value = "Kris";

        var input2 = document.createElement("input");
        input2.setAttribute("name", "Email");
        input2.value = "AnEmail@Address.here";

        document.body.appendChild(input1);
        document.body.appendChild(input2);

        msngr("TestTopic").on(function(payload) {
            expect(payload).to.exist;
            expect(payload["Name"]).to.exist;
            expect(payload["Name"]).to.equal("Kris");
            expect(payload["Email"]).to.exist;
            expect(payload["Email"]).to.equal("AnEmail@Address.here");

            document.body.removeChild(input1);
            document.body.removeChild(input2);

            done();
        });

        msngr("TestTopic").option("dom", ["input"]).emit();
    });

    it("dom action - gathers multiple values with multiple selectors that each match an element 1:1", function(done) {
        var input1 = document.createElement("input");
        input1.setAttribute("name", "Name");
        input1.value = "Kris";

        var input2 = document.createElement("input");
        input2.setAttribute("name", "Email");
        input2.value = "AnEmail@Address.here";

        document.body.appendChild(input1);
        document.body.appendChild(input2);

        msngr("TestTopic").on(function(payload) {
            expect(payload).to.exist;
            expect(payload["Name"]).to.exist;
            expect(payload["Name"]).to.equal("Kris");
            expect(payload["Email"]).to.exist;
            expect(payload["Email"]).to.equal("AnEmail@Address.here");

            document.body.removeChild(input1);
            document.body.removeChild(input2);

            done();
        });

        msngr("TestTopic").option("dom", ["input[name=Name]", "input[name=Email]"]).emit();
    });

    it("dom action - gathers multiple values with multiple IDs that each match an element 1:1", function(done) {
        var input1 = document.createElement("input");
        input1.setAttribute("name", "Name");
        input1.id = "Name";
        input1.value = "Kris";

        var input2 = document.createElement("input");
        input2.setAttribute("name", "Email");
        input2.id = "Email";
        input2.value = "AnEmail@Address.here";

        document.body.appendChild(input1);
        document.body.appendChild(input2);

        msngr("TestTopic").on(function(payload) {
            expect(payload).to.exist;
            expect(payload["Name"]).to.exist;
            expect(payload["Name"]).to.equal("Kris");
            expect(payload["Email"]).to.exist;
            expect(payload["Email"]).to.equal("AnEmail@Address.here");

            document.body.removeChild(input1);
            document.body.removeChild(input2);

            done();
        });

        msngr("TestTopic").option("dom", ["#Name", "#Email"]).emit();
    });
});
