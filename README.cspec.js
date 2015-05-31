if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("./msngr");
}

describe("./README.md", function () {
    "use strict";

    before(function () {
        msngr.debug = true;
    });

    beforeEach(function () {
        msngr.internal.reset();
    });

    after(function () {
        msngr.debug = false;
    });

    it("Example 1 of DOM binding", function (done) {
        var userInput = document.createElement("input");
        userInput.setAttribute("name", "Username");
        userInput.value = "Kris";

        var passwordInput = document.createElement("input");
        passwordInput.setAttribute("name", "Password");
        passwordInput.value = "hunter2";

        var button = document.createElement("button");
        button.appendChild(document.createTextNode("Submit"));

        document.body.appendChild(userInput);
        document.body.appendChild(passwordInput);
        document.body.appendChild(button);

        msngr("User", "Save")
            .bind("button", "click")
            .option("dom", ["input"])
            .on(function (payload) {
                expect(payload.Username).to.equal("Kris");
                expect(payload.Password).to.equal("hunter2");

                document.body.removeChild(userInput);
                document.body.removeChild(passwordInput);
                document.body.removeChild(button);

                done();
            });

        var me = document.createEvent("MouseEvents");
        me.initEvent("click", true, false);
        button.dispatchEvent(me);
    });
});
