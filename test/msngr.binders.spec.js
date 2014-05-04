var tests = (function (description, msngrPath, uniqueKey) {
    var assert = require("assert");

    var fs = require("fs");
    var msngrFile = fs.readFileSync(msngrPath, { encoding: "utf-8" });

    var jsdom = require("jsdom");
    jsdom.env("<html><body></body></html>", {
        src: [msngrFile],
        done: function (errors, window) {
            var msngr = window.msngr;
            var document = window.document;

            describe(description, function () {
                it("Client-side msngr initialized successfully in browser environment", function () {
                    assert.equal((msngr !== undefined), true);
                });
                it("At least one binder is registered", function () {
                    assert.equal((msngr.registry.binders.count() > 0), true);
                });
                it("msngr.utils.isHtmlElement(obj)", function () {
                    assert.equal(msngr.utils.isHtmlElement(function () {}), false);
                    assert.equal(msngr.utils.isHtmlElement("test"), false);
                    assert.equal(msngr.utils.isHtmlElement(""), false);
                    assert.equal(msngr.utils.isHtmlElement(undefined), false);
                    assert.equal(msngr.utils.isHtmlElement(null), false);
                    assert.equal(msngr.utils.isHtmlElement({}), false);
                    assert.equal(msngr.utils.isHtmlElement(7), false);
                    assert.equal(msngr.utils.isHtmlElement([]), false);
                    assert.equal(msngr.utils.isHtmlElement(new Date()), false);
                    assert.equal(msngr.utils.isHtmlElement(document.createElement("div")), true);
                    assert.equal(msngr.utils.isHtmlElement(document.createElement("input")), true);
                    assert.equal(msngr.utils.isHtmlElement(document.createElement("body")), true);
                    assert.equal(msngr.utils.isHtmlElement(document.createElement("canvas")), true);
                });
            });
        }
    });

});
tests("[Concatenated] msngr.binders", "./msngr.js", Math.floor(Math.random() * 1000));
tests("[Minified] msngr.binders", "./msngr.min.js", Math.floor(Math.random() * 1000));
