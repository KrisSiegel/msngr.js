if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../../msngr");
}

describe("./objects/mache.js", function() {
    "use strict";

    it("msngr.mache() - Creates a new merge cache object", function () {
        var mache = msngr.mache();
        expect(mache).to.exist;
        expect(mache.get).to.exist;
        expect(mache.set).to.exist;
    });

    it("msngr.mache().set() / .get() - Sets and gets data", function () {
        var mache = msngr.mache();
        mache.set("something", "cool");
        mache.set("whoa", { like: "whoa" } );
        expect(mache.get("something")).to.equal("cool");
        expect(mache.get("whoa").like).to.equal("whoa");
    });

    it("msngr.mache().data - Is always correct", function () {
        var mache = msngr.mache();
        mache.set("something", 15);
        expect(mache.data.something).to.exist;
        expect(mache.data.something).to.equal(15);

        expect(mache.revert("something")).to.equal(true);
        expect(mache.data.something).to.not.exist;
    });

    it("msngr.mache().meta - Provides correct meta data", function () {
        var mache = msngr.mache();
        expect(mache.meta).to.exist;
        expect(mache.meta.revisions.toKeep).to.exist;
        expect(mache.meta.revisions.toKeep).to.equal(3);

        var mache2 = msngr.mache({
            revisions: 15
        });
        expect(mache2.meta.revisions.toKeep).to.exist;
        expect(mache2.meta.revisions.toKeep).to.equal(15);
    });

    it("msngr.mache() - Respects the revisions to keep", function () {
        var mache = msngr.mache({
            revisions: 2
        });

        mache.set("test", "something");
        mache.set("test", "another");
        mache.set("test", "weeee");

        expect(mache.revert("test")).to.equal(true);
        expect(mache.revert("test")).to.equal(true);
        expect(mache.revert("test")).to.equal(false);
    });

    it("msngr.mache().set / .revert() - Sets and reverts appropriately", function () {
        var mache = msngr.mache();
        expect(mache.revert("whatever")).to.equal(false);
        mache.set("whatever", "whoa");
        expect(mache.get("whatever")).to.equal("whoa");
        expect(mache.revert("whatever")).to.equal(true);
        expect(mache.get("whatever")).to.not.exist;

        mache.set("test", { one: 1 });
        mache.set("test", { two: 2 });
        mache.set("test", { three: 3 });

        expect(mache.get("test").one).to.equal(1);
        expect(mache.get("test").two).to.equal(2);
        expect(mache.get("test").three).to.equal(3);

        mache.revert("test");
        expect(mache.get("test").one).to.equal(1);
        expect(mache.get("test").two).to.equal(2);
        expect(mache.get("test").three).to.not.exist;

        mache.revert("test");
        expect(mache.get("test").one).to.equal(1);
        expect(mache.get("test").two).to.not.exist;
        expect(mache.get("test").three).to.not.exist;

        mache.revert("test");
        expect(mache.get("test")).to.not.exist;
    });

    it("msngr.mache().begin() / .rollback() - Starting a transaction then rolling back commits nothing", function () {
        var mache = msngr.mache();
        mache.set("something", "aww yiss");
        expect(mache.begin()).to.equal(true);
        expect(mache.get("something")).to.equal("aww yiss");
        mache.set("something", "bbq");
        expect(mache.get("something")).to.equal("bbq");
        expect(mache.rollback()).to.equal(true);
        expect(mache.get("something")).to.equal("aww yiss");
    });

    it("msngr.mache().begin() / .commit() - Starting a transaction then committing saves everything", function () {
        var mache = msngr.mache();
        mache.set("test1", "yupyup");
        expect(mache.begin()).to.equal(true);
        mache.set("test1", "nono");
        expect(mache.get("test1")).to.equal("nono");
        expect(mache.commit()).to.equal(true);
        expect(mache.get("test1")).to.equal("nono");
        expect(mache.revert("test1")).to.equal(true);
        expect(mache.get("test1")).to.equal("yupyup");
    });

    it("msngr.mache().remove() - Removes correctly inside and outside transactions", function () {
        var mache = msngr.mache();
        mache.set("testing", "value1");
        expect(mache.remove("testing")).to.equal(true);
        expect(mache.get("testing")).to.not.exist;

        mache.set("test1", "value9");
        expect(mache.begin()).to.equal(true);
        mache.set("test2", "value10");
        expect(mache.remove("test1")).to.equal(true);
        expect(mache.get("test1")).to.not.exist;
        expect(mache.remove("test2")).to.equal(true);
        expect(mache.get("test2")).to.not.exist;
        expect(mache.rollback()).to.equal(true);

        expect(mache.get("test1")).to.equal("value9");
        expect(mache.get("test2")).to.not.exist;
    });

    it("msngr.mache().begin() / .rollback() / .commit() - Handles duplicate calls", function () {
        var mache = msngr.mache();
        expect(mache.rollback()).to.equal(false);
        expect(mache.commit()).to.equal(false);
        expect(mache.begin()).to.equal(true);
        expect(mache.begin()).to.equal(false);
        expect(mache.rollback()).to.equal(true);
        expect(mache.rollback()).to.equal(false);
        expect(mache.begin()).to.equal(true);
        expect(mache.commit()).to.equal(true);
        expect(mache.commit()).to.equal(false);
    });

    it("msngr.mache().getDeep() - Safely gets a property from a stored object", function () {
        var mache = msngr.mache();
        mache.set("config", {
            this: {
                is: {
                    super: {
                        deep: "yup",
                        bool: true
                    }
                }
            }
        });

        expect(msngr.isObject(mache.getDeep("config", "this"))).to.equal(true);
        expect(msngr.isObject(mache.getDeep("config", "this.is"))).to.equal(true);
        expect(mache.getDeep("config", "this.is.super.deep")).to.equal("yup");
        expect(mache.getDeep("config", "this.is.super.bool")).to.equal(true);
        expect(mache.getDeep("config", "this.is.not.a.real.path")).to.not.exist;
        expect(mache.getDeep("config", "this.is.not.a.real.path", 42)).to.equal(42);
    });

    it("msngr.mache() - When enabled data changes are emitted", function (done) {
        var mache = msngr.mache({
            emitChanges: true
        });
        mache.set("something", "first");
        msngr("msngr.mache", "change").on(function (data, msg) {
            expect(data).to.exist;
            expect(data.newValue).to.equal("second");
            expect(data.oldValue).to.equal("first");
            done();
        });
        mache.set("something", "second");
    });

    it("msngr.mache() - getDeep() property returns boolean values", function () {
        var mache = msngr.mache();
        mache.set("something", {
            like: {
                totally: {
                    yes: true,
                    no: false
                }
            }
        });

        expect(mache.getDeep("something", "like.totally.yes")).to.equal(true);
        expect(mache.getDeep("something", "like.totally.no")).to.equal(false);
    });

});
