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

    it("msngr.builders.msg() - Builds multiple messages while maintaining separate instances", function () {
        var build1 = msngr.builders.msg();
        var build2 = msngr.builders.msg();
        var build3 = msngr.builders.msg();

        build1.topic("ChickenFeet");
        build2.category("Beer");
        build3.topic("Floating");
        build2.topic("Something");
        build1.category("Fowl");

        build1 = build1.build();
        build2 = build2.build();
        build3 = build3.build();

        expect(build1.topic).to.equal("ChickenFeet");
        expect(build1.category).to.equal("Fowl");
        expect(build2.topic).to.equal("Something");
        expect(build2.category).to.equal("Beer");
        expect(build3.topic).to.equal("Floating");
    });
});
