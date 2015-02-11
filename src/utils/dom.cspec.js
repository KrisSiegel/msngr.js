if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./utils/dom.js", function () {
    "use strict";

    it("msngr.utils.isHtmlElement(obj)", function () {
        expect(msngr.utils.isHtmlElement(function () {})).to.equal(false);
        expect(msngr.utils.isHtmlElement("test")).to.equal(false);
        expect(msngr.utils.isHtmlElement("")).to.equal(false);
        expect(msngr.utils.isHtmlElement(undefined)).to.equal(false);
        expect(msngr.utils.isHtmlElement(null)).to.equal(false);
        expect(msngr.utils.isHtmlElement({})).to.equal(false);
        expect(msngr.utils.isHtmlElement(7)).to.equal(false);
        expect(msngr.utils.isHtmlElement([])).to.equal(false);
        expect(msngr.utils.isHtmlElement(new Date())).to.equal(false);
        expect(msngr.utils.isHtmlElement(document.createElement("div"))).to.equal(true);
        expect(msngr.utils.isHtmlElement(document.createElement("input"))).to.equal(true);
        expect(msngr.utils.isHtmlElement(document.createElement("body"))).to.equal(true);
        expect(msngr.utils.isHtmlElement(document.createElement("canvas"))).to.equal(true);
    });

    it("msngr.utils.isNodeList(obj)", function () {
        var div1 = document.createElement("div");
        var div2 = document.createElement("div");
        var div3 = document.createElement("div");

        div1.appendChild(div2);
        div1.appendChild(div3);

        expect(msngr.utils.isNodeList(div1)).to.equal(false);
        expect(msngr.utils.isNodeList(div1.childNodes)).to.equal(true);
    });

    it("msngr.utils.findElement(obj)", function () {
        var div = document.createElement("div");
        div.style.display = "none";

        var div2 = document.createElement("div");
        div2.setAttribute("id", "TestID1");

        var div3 = document.createElement("div");
        div3.setAttribute("class", "TestClass1");

        var p1 = document.createElement("p");
        div3.appendChild(p1);

        div.appendChild(div2);
        div.appendChild(div3);

        document.body.appendChild(div);

        expect(msngr.utils.isHtmlElement(msngr.utils.findElement("#TestID1"))).to.equal(true);
        expect(msngr.utils.isHtmlElement(msngr.utils.findElement("#TestI1"))).to.equal(false);
        expect(msngr.utils.isHtmlElement(msngr.utils.findElement("TestID1"))).to.equal(true);
        expect(msngr.utils.isHtmlElement(msngr.utils.findElement(".TestClass1"))).to.equal(true);
        expect(msngr.utils.isHtmlElement(msngr.utils.findElement(".Testass1"))).to.equal(false);
        expect(msngr.utils.isHtmlElement(msngr.utils.findElement("div div p"))).to.equal(true);
        expect(msngr.utils.isHtmlElement(msngr.utils.findElement("p div"))).to.equal(false);
        expect(msngr.utils.isHtmlElement(msngr.utils.findElement(document.createElement("div")))).to.equal(true);
    });

    it("msngr.utils.getDomPath(element)", function () {
        var div = document.createElement("div");
        div.style.display = "none";

        var p = document.createElement("p");
        p.id = "TestID2";

        div.appendChild(p);

        document.body.appendChild(div);
        var path = msngr.utils.getDomPath(msngr.utils.findElement("TestID2"));
        expect(msngr.utils.querySelectorAllWithEq(path)[0].id).to.equal("TestID2");
    });

    it("msngr.utils.querySelectorAllWithEq(selector)", function () {
        var div = document.createElement("div");
        div.style.display = "none";

        var idiv = document.createElement("div");
        idiv.id = "TestID3";

        var p1 = document.createElement("p");
        p1.id = "TestID3p1";

        var p2 = document.createElement("p");
        p2.id = "TestID3p2";

        var p3 = document.createElement("p");
        p3.id = "TestID3p3";

        idiv.appendChild(p1);
        idiv.appendChild(p2);
        idiv.appendChild(p3);

        div.appendChild(idiv);

        document.body.appendChild(div);

        expect(msngr.utils.querySelectorAllWithEq("div#TestID3 > p:eq(0)")[0].id).to.equal("TestID3p1");
        expect(msngr.utils.querySelectorAllWithEq("div#TestID3 > p:eq(1)")[0].id).to.equal("TestID3p2");
        expect(msngr.utils.querySelectorAllWithEq("div#TestID3 > p:eq(2)")[0].id).to.equal("TestID3p3");

    });

    it("msngr.utils.querySelectorWithEq(selector)", function () {
        var div = document.createElement("div");
        div.style.display = "none";

        var idiv = document.createElement("div");
        idiv.id = "TestID3";

        var p1 = document.createElement("p");
        p1.id = "TestID3p1";

        var p2 = document.createElement("p");
        p2.id = "TestID3p2";

        var p3 = document.createElement("p");
        p3.id = "TestID3p3";

        idiv.appendChild(p1);
        idiv.appendChild(p2);
        idiv.appendChild(p3);

        div.appendChild(idiv);

        document.body.appendChild(div);

        expect(msngr.utils.querySelectorWithEq("div#TestID3 > p:eq(0)").id).to.equal("TestID3p1");
        expect(msngr.utils.querySelectorWithEq("div#TestID3 > p:eq(1)").id).to.equal("TestID3p2");
        expect(msngr.utils.querySelectorWithEq("div#TestID3 > p:eq(2)").id).to.equal("TestID3p3");

    });
});
