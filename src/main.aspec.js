if (typeof chai === "undefined" && typeof window === "undefined") {
    var chai = require("chai");
}

if (typeof expect === "undefined") {
    var expect = chai.expect;
}

if (typeof msngr === "undefined" && typeof window === "undefined") {
    var msngr = require("../msngr");
}

describe("./main.js", function() {
    "use strict";

    it("msngr - expect object to exist", function() {
        expect(msngr).to.exist;
    });

    it("msngr.merge(input1, input2) - expect method to exist", function() {
        expect(msngr.merge).to.exist;
    });

    it("msngr.merge(input1, input2) - merges arrays from input1 and input2 without duplicates", function() {
        var obj1 = {
            test: [1, 2, 3]
        };
        var obj2 = {
            test: [2, 3, 4]
        };

        var merged = msngr.merge(obj1, obj2);

        expect(merged.test).to.exist;
        expect(merged.test.length).to.equal(4);
    });

    it("msngr.merge(input1, input2) - expect properties to merge from input1 and input2", function() {
        var obj1 = {
            prop: "something"
        };
        var obj2 = {
            some: "thing"
        };

        var merged = msngr.merge(obj1, obj2);

        expect(merged.some).to.exist;
        expect(merged.prop).to.exist;
        expect(merged.prop).to.equal("something");
    });

    it("msngr.merge(input1, input2) - expect deeply nested methods to merge from input1 and input2", function() {
        var obj1 = {
            this: {
                is: {
                    a: {
                        test: {
                            yup: function() {
                                return "yup!";
                            }
                        }
                    }
                }
            }
        };

        var obj2 = {
            whatever: function() {
                return "whatever";
            }
        };

        var merged = msngr.merge(obj1, obj2);

        expect(merged.whatever).to.exist;
        expect(merged.whatever()).to.equal("whatever");

        expect(merged.this).to.exist;
        expect(merged.this.is).to.exist;
        expect(merged.this.is.a).to.exist;
        expect(merged.this.is.a.test).to.exist;
        expect(merged.this.is.a.test.yup).to.exist;
        expect(merged.this.is.a.test.yup()).to.equal("yup!");
    });

    it("msngr.merge(input1, input2) - merges a method with properties", function() {
        var myFunc = function() {
            return 15;
        };

        var myProps = {
            something: "yup",
            life: 42
        };

        var merged = msngr.merge(myFunc, myProps);

        expect(merged).to.exist;
        expect(merged.something).to.exist;
        expect(merged.life).to.exist;
        expect(merged.something).to.equal("yup");
        expect(merged.life).to.equal(42);
        expect(merged()).to.equal(15);
    });

    it("msngr.merge(input1, input2) - merging undefined value is simply ignored", function() {
        var merged = msngr.merge(undefined, {});

        expect(merged).to.exist;
        expect(Object.keys(merged).length).to.equal(0);
    });

    it("msngr.merge(input1, input2) - Property extends a string with another string", function() {
        var merged = msngr.merge("whatever", "something");
        expect(merged).to.exist;
        expect(msngr.getType(merged)).to.equal("[object String]");
        expect(merged).to.equal("whateversomething");
    });

    it("msngr.merge(input1, input2) - Overwrites properly", function() {
        var first = {
            val1: "stuff"
        };
        var second = {
            val1: 17
        };

        var merged = msngr.merge(first, second);
        expect(merged).to.exist;
        expect(merged.val1).to.exist;
        expect(merged.val1).to.equal(17);
    });

    it("msngr.merge(input1, input2, input3, input4, input5, input6, input7, input8) - Overwrites properly with multiple parameters", function() {
        var first = {
            val1: "stuff"
        };
        var second = {
            val1: 17
        };
        var third = {
            val1: "chicken nuggets"
        };
        var fourth = {
            val1: function() {}
        };
        var fifth = {
            val1: null
        };
        var sixth = {
            val1: 1
        };
        var seventh = {
            val1: [0, 1, 2]
        };
        var eighth = {
            val1: "hockey"
        };

        var merged1 = msngr.merge(first, second, third);
        var merged2 = msngr.merge(first, second, third, fourth);
        var merged3 = msngr.merge(first, second, third, fourth, fifth);
        var merged4 = msngr.merge(first, second, third, fourth, fifth, sixth);
        var merged5 = msngr.merge(first, second, third, fourth, fifth, sixth, seventh);
        var merged6 = msngr.merge(first, second, third, fourth, fifth, sixth, seventh, eighth);

        expect(merged1).to.exist;
        expect(merged2).to.exist;
        expect(merged3).to.exist;
        expect(merged4).to.exist;
        expect(merged5).to.exist;
        expect(merged6).to.exist;

        expect(merged1.val1).to.exist;
        expect(merged2.val1).to.exist;
        expect(merged3.val1).to.not.exist;
        expect(merged4.val1).to.exist;
        expect(merged5.val1).to.exist;
        expect(merged6.val1).to.exist;

        expect(merged1.val1).to.equal("chicken nuggets");
        expect(msngr.getType(merged2.val1)).to.equal("[object Function]");
        expect(merged3.val1).to.equal(null);
        expect(merged4.val1).to.equal(1);
        expect(merged5.val1.length).to.equal(3);
        expect(merged6.val1).to.equal("hockey");
    });

    it("msngr.extend(obj, target) - expect method to exist", function() {
        expect(msngr.extend).to.exist;
    });

    it("msngr.extend(obj, target) - extend msngr", function() {
        msngr.extend((function(external, internal) {
            return {
                sayHello: function() {
                    return "hello";
                }
            };
        }));

        expect(msngr.sayHello).to.exist;
        expect(msngr.sayHello()).to.equal("hello");

        delete msngr.sayHello;
    });

    it("msngr.copy(obj) - copies an object", function() {
        var obj = {
            stuff: {
                goes: {
                    here: {
                        value: 41,
                        str: "some",
                        fn: function () {},
                        yeah: true
                    }
                }
            }
        };

        var copy = msngr.copy(obj);

        // Make sure the references / copy are at least good
        expect(copy).to.exist;
        expect(copy.stuff).to.exist;
        expect(copy.stuff.goes).to.exist;
        expect(copy.stuff.goes.here).to.exist;
        expect(copy.stuff.goes.here.value).to.equal(41);
        expect(copy.stuff.goes.here.str).to.equal("some");
        expect(msngr.isFunction(copy.stuff.goes.here.fn)).to.equal(true);
        expect(copy.stuff.goes.here.yeah).to.equal(true);

        // Let's make sure this is a real copy and not references to the original
        obj.stuff.goes.here.value = 999;
        expect(obj.stuff.goes.here.value).to.equal(999);
        expect(copy.stuff.goes.here.value).to.equal(41);

        obj.stuff.goes.here.str = "whatever!";
        expect(obj.stuff.goes.here.str).to.equal("whatever!");
        expect(copy.stuff.goes.here.str).to.equal("some");
    });

    it("msngr.debug - property setting exports internal object for testing and debugging", function() {
        msngr.debug = false;
        expect(msngr.internal).to.not.exist;
        expect(msngr.debug).to.equal(false);
        msngr.debug = true;
        expect(msngr.internal).to.exist;
        expect(msngr.debug).to.equal(true);
        msngr.debug = false;
        expect(msngr.internal).to.not.exist;
    });

    it("msngr.config() - can set key value pairs for configuration", function() {
        msngr.config("something_goofy", {
            crazy: true
        });

        msngr.debug = true;
        expect(msngr.internal.config.something_goofy).to.exist;
        expect(msngr.internal.config.something_goofy.crazy).to.exist;
        expect(msngr.internal.config.something_goofy.crazy).to.equal(true);
        msngr.debug = false;
    });

    it("msngr.config() - configuration options should be additive", function() {
        msngr.config("yotest", {
            something: true,
            another: {
                what: "yes"
            }
        });

        msngr.config("yotest", {
            okay: 47
        });

        msngr.debug = true;
        expect(msngr.internal.config.yotest).to.exist;
        expect(msngr.internal.config.yotest.something).to.exist;
        expect(msngr.internal.config.yotest.another).to.exist;
        expect(msngr.internal.config.yotest.okay).to.exist;
        expect(msngr.internal.config.yotest.okay).to.equal(47);

        msngr.config("yotest", {
            okay: 999
        });

        expect(msngr.internal.config.yotest.okay).to.equal(999);
        expect(msngr.internal.config.yotest.another.what).to.equal("yes");
    });

    it("msngr.config() - providing only the key should return the existing config", function() {
        msngr.config("whatevers", {
            stuff: true,
            you: {
                there: "yes"
            }
        });

        expect(msngr.config("whatevers")).to.exist;
        expect(msngr.config("whatevers").stuff).to.equal(true);
        expect(msngr.config("whatevers").you.there).to.equal("yes");
    });

    it("msngr.config() - generates properties using a key specified in the configuration", function() {
        expect(msngr.config.yourface).to.not.exist;

        msngr.config("yourface", {
            is: "ugly"
        });

        expect(msngr.config.yourface).to.exist;
        expect(msngr.config.yourface.is).to.exist;
        expect(msngr.config.yourface.is).to.equal("ugly");
    });

    it("msngr.unconfig() - Unconfigurates something already configurated", function() {
        msngr.config("something", {
            test: 1
        });

        expect(msngr.config("something")).to.exist;
        expect(msngr.config("something").test).to.exist;

        msngr.unconfig("something");
        expect(msngr.config("something")).to.not.exist;
        expect(msngr.config.something).to.not.exist;
    });
});
