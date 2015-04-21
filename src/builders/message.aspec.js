if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./builders/message.js", function () {
    "use strict";

    it("msngr.builders.msg() - Builds basic message", function () {
        var message = msngr.builders.msg()
            .topic("TestTopic1")
            .category("TestCategory1")
            .dataType("TestDataType1")
            .payload({ data: 1 })
            .build();

        expect(message.topic).to.equal("TestTopic1");
        expect(message.category).to.equal("TestCategory1");
        expect(message.dataType).to.equal("TestDataType1");
        expect(message.payload.data).to.equal(1);
    });

    it("msngr.builders.msg() - Builds a message with an action", function () {
        var message = msngr.builders.msg()
            .topic("TestTopic1")
            .dom(true)
            .build();

        expect(message.topic).to.equal("TestTopic1");
        expect(message.dom).to.equal(true);
    });
});
