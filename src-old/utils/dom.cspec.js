if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./utils/dom.js", function() {
    "use strict";

    beforeEach(function() {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it("msngr.isHtmlElement(obj) - obj is a function", function() {
        expect(msngr.isHtmlElement(function() {})).to.equal(false);
    });

    it("msngr.isHtmlElement(obj) - obj is a string", function() {
        expect(msngr.isHtmlElement("test")).to.equal(false);
    });

    it("msngr.isHtmlElement(obj) - obj is an empty string", function() {
        expect(msngr.isHtmlElement("")).to.equal(false);
    });

    it("msngr.isHtmlElement(obj) - obj is undefined", function() {
        expect(msngr.isHtmlElement(undefined)).to.equal(false);
    });

    it("msngr.isHtmlElement(obj) - obj is null", function() {
        expect(msngr.isHtmlElement(null)).to.equal(false);
    });

    it("msngr.isHtmlElement(obj) - obj is an object", function() {
        expect(msngr.isHtmlElement({})).to.equal(false);
    });

    it("msngr.isHtmlElement(obj) - obj is a number", function() {
        expect(msngr.isHtmlElement(7)).to.equal(false);
    });

    it("msngr.isHtmlElement(obj) - obj is an array", function() {
        expect(msngr.isHtmlElement([])).to.equal(false);
    });

    it("msngr.isHtmlElement(obj) - obj is a date", function() {
        expect(msngr.isHtmlElement(new Date())).to.equal(false);
    });

    it("msngr.isHtmlElement(obj) - obj is a div element", function() {
        expect(msngr.isHtmlElement(document.createElement("div"))).to.equal(true);
    });

    it("msngr.isHtmlElement(obj) - obj is an input element", function() {
        expect(msngr.isHtmlElement(document.createElement("input"))).to.equal(true);
    });

    it("msngr.isHtmlElement(obj) - obj is a body element", function() {
        expect(msngr.isHtmlElement(document.createElement("body"))).to.equal(true);
    });

    it("msngr.isHtmlElement(obj) - obj is a canvas element", function() {
        expect(msngr.isHtmlElement(document.createElement("canvas"))).to.equal(true);
    });

    it("msngr.isNodeList(obj) - obj is a single div element", function() {
        var div = document.createElement("div");

        expect(msngr.isNodeList(div)).to.equal(false);
    });

    it("msngr.isNodeList(obj) - obj is a nodelist", function() {
        var div1 = document.createElement("div");
        var div2 = document.createElement("div");
        var div3 = document.createElement("div");

        div1.appendChild(div2);
        div1.appendChild(div3);

        expect(msngr.isNodeList(div1.childNodes)).to.equal(true);
    });

    it("msngr.findElement(obj) - obj is an HTMLElement", function() {
        expect(msngr.isHtmlElement(msngr.findElement(document.createElement("div")))).to.equal(true);
    });

    it("msngr.findElement(obj) - obj is an HTMLElement with root specified", function() {
        expect(msngr.isHtmlElement(msngr.findElement(document.createElement("div"), document))).to.equal(true);
    });

    it("msngr.findElement(obj) - obj is an id selector (#MyID)", function() {
        var div = document.createElement("div");
        div.setAttribute("id", "TestID1");
        document.body.appendChild(div);
        expect(msngr.isHtmlElement(msngr.findElement("#TestID1"))).to.equal(true);
        document.body.removeChild(div);
        expect(msngr.isHtmlElement(msngr.findElement("#TestID1"))).to.equal(false);
    });

    it("msngr.findElement(obj) - obj is a class selector (.TestClass)", function() {
        var div = document.createElement("div");
        div.setAttribute("class", "TestClass");
        document.body.appendChild(div);
        expect(msngr.isHtmlElement(msngr.findElement(".TestClass"))).to.equal(true);
        document.body.removeChild(div);
        expect(msngr.isHtmlElement(msngr.findElement(".TestClass"))).to.equal(false);
    });

    it("msngr.findElement(obj) - obj is a html target selector", function() {
        var div = document.createElement("div");
        var div2 = document.createElement("div");
        var p = document.createElement("p");

        div2.appendChild(p);
        div.appendChild(div2);

        document.body.appendChild(div);
        expect(msngr.isHtmlElement(msngr.findElement("div div p"))).to.equal(true);
        document.body.removeChild(div);
        expect(msngr.isHtmlElement(msngr.findElement("div div p"))).to.equal(false);
    });

    it("msngr.findElements(obj) - obj is an id selector (#MyID)", function() {
        var div = document.createElement("div");
        div.setAttribute("id", "TestID1");
        document.body.appendChild(div);
        expect(msngr.isNodeList(msngr.findElements("#TestID1"))).to.equal(true);
        expect(msngr.findElements("#TestID1").length).to.equal(1);
        document.body.removeChild(div);
        expect(msngr.isNodeList(msngr.findElement("#TestID1"))).to.equal(true);
        expect(msngr.findElements("#TestID1").length).to.equal(0);
    });

    it("msngr.findElements(obj) - obj is a class selector (.TestClass)", function() {
        var div = document.createElement("div");
        div.setAttribute("class", "TestClass");

        var div2 = document.createElement("div");
        div2.setAttribute("class", "TestClass");
        document.body.appendChild(div);
        document.body.appendChild(div2);
        expect(msngr.isNodeList(msngr.findElements(".TestClass"))).to.equal(true);
        expect(msngr.findElements(".TestClass").length).to.equal(2);
        document.body.removeChild(div);
        document.body.removeChild(div2);
        expect(msngr.isNodeList(msngr.findElements(".TestClass"))).to.equal(true);
        expect(msngr.findElements(".TestClass").length).to.equal(0);
    });

    it("msngr.findElement(obj) - obj is a html target selector", function() {
        var div = document.createElement("div");
        var div2 = document.createElement("div");
        var p = document.createElement("p");

        div2.appendChild(p);
        div.appendChild(div2);

        document.body.appendChild(div);
        expect(msngr.isNodeList(msngr.findElements("div div p"))).to.equal(true);
        expect(msngr.findElements("div div p").length).to.equal(1);
        document.body.removeChild(div);
        expect(msngr.isNodeList(msngr.findElements("div div p"))).to.equal(true);
        expect(msngr.findElements("div div p").length).to.equal(0);
    });

    it("msngr.getDomPath(element) - returns proper selector of an ID when a specified node has an ID", function() {
        var div = document.createElement("div");
        div.style.display = "none";

        var p = document.createElement("p");
        p.id = "TestID2";

        div.appendChild(p);

        document.body.appendChild(div);
        var path = msngr.getDomPath(msngr.findElement("#TestID2"));
        expect(path).to.equal("#TestID2");
        expect(msngr.querySelectorAllWithEq(path)[0].id).to.equal("TestID2");
        document.body.removeChild(div);
    });

    it("msngr.getDomPath(element) - returns proper selector of a node when no ID exists", function() {
        var div = document.createElement("div");
        div.style.display = "none";

        var p = document.createElement("p");
        p.setAttribute("name", "somethingsomething12");

        div.appendChild(p);
        document.body.appendChild(div);
        var path = msngr.getDomPath(p);
        expect(path).to.equal("HTML > BODY:eq(2) > DIV > P");
        expect(msngr.findElement(path).getAttribute("name")).to.equal("somethingsomething12");
        document.body.removeChild(div);
    });

    it("msngr.querySelectorAllWithEq(selector) - selector uses eq to target specific indexes", function() {
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

        expect(msngr.querySelectorAllWithEq("div#TestID3 > p:eq(0)")[0].id).to.equal("TestID3p1");
        expect(msngr.querySelectorAllWithEq("div#TestID3 > p:eq(1)")[0].id).to.equal("TestID3p2");
        expect(msngr.querySelectorAllWithEq("div#TestID3 > p:eq(2)")[0].id).to.equal("TestID3p3");

    });

    it("msngr.querySelectorAllWithEq(selector) - selector uses eq to target specific indexes and works with specific root", function() {
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

        var strong1 = document.createElement("strong");
        strong1.id = "StrongID1";
        p3.appendChild(strong1);

        idiv.appendChild(p1);
        idiv.appendChild(p2);
        idiv.appendChild(p3);

        div.appendChild(idiv);

        document.body.appendChild(div);

        expect(msngr.querySelectorAllWithEq("div#TestID3 > p:eq(0)", document)[0].id).to.equal("TestID3p1");
        expect(msngr.querySelectorAllWithEq("div#TestID3 > p:eq(1)", document)[0].id).to.equal("TestID3p2");
        expect(msngr.querySelectorAllWithEq("div#TestID3 > p:eq(2)", document)[0].id).to.equal("TestID3p3");
        expect(msngr.querySelectorAllWithEq("div#TestID3 > p:eq(2) > strong:eq(0)", document)[0].id).to.equal("StrongID1");
    });

    it("msngr.querySelectorWithEq(selector) - selector uses eq to target specific indexes", function() {
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

        expect(msngr.querySelectorWithEq("div#TestID3 > p:eq(0)").id).to.equal("TestID3p1");
        expect(msngr.querySelectorWithEq("div#TestID3 > p:eq(1)").id).to.equal("TestID3p2");
        expect(msngr.querySelectorWithEq("div#TestID3 > p:eq(2)").id).to.equal("TestID3p3");

    });
});
