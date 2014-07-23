if (typeof assert === "undefined" && typeof window === "undefined") {
	var assert = require("assert");
}
if (typeof chai === "undefined" && typeof window === "undefined") {
	var chai = require("chai");
}

var expect = chai.expect;

var tests = (function (description, msngr, uniqueKey) {
	describe(description, function () {
		it("msngr", function () {
			// Ensure msngr exists in the first place
			expect(msngr).to.not.equal(undefined);
		});

		it("msngr.extend()", function () {
			// Check that extend exists
			expect(msngr.extend).to.not.equal(undefined);
			// Ensure that the method we're adding doesn't exist
			expect(msngr.test_extend).to.equal(undefined);
			// Extend msngr with new method
			msngr.extend({
				test_extend: function () {

				}
			});
			// Ensure new method now exists
			expect(msngr.test_extend).to.not.equal(undefined);
			// Drop new method
			delete msngr.test_extend;
			// Ensure new method is gone again
			expect(msngr.test_extend).to.equal(undefined);

			// Complex extend
			msngr.extend({
				test_extend: {
					test: "test"
				}
			});
			msngr.extend({
				test_extend: {
					another: "test"
				}
			});
			expect(msngr.test_extend.test).to.equal(msngr.test_extend.another);
			expect(msngr.test_extend.test).to.not.equal(msngr.test);
			// Drop new methods again
			delete msngr.test_extend;

			// Check mixin support with arrays; no modifying of base msngr object.
			var obj = msngr.extend({
				testing: {
					tests: ["test", "again"]
				},
				another: ["yup", "yip", "yop"]
			}, {
				testing: {
					test: "yes",
					tests: ["another", "weee"]
				}
			});
			expect(obj.testing.tests.length > 0).to.equal(true);
			expect(obj.testing.tests.length === 4).to.equal(true);
			expect(obj.another.length > 0).to.equal(true);
			expect(msngr.utils.getType(obj.testing.tests)).to.equal("[object Array]");
			expect(msngr.utils.getType(obj.another)).to.equal("[object Array]");
		});

		it("msngr.emit() throws", function (done) {
			expect(msngr.emit).to.throw();
			done();
		});

		it("msngr.emit() with topic", function (done) {
			msngr.register("test_" + uniqueKey, function () {
				done();
			}, this);
			msngr.emit("test_" + uniqueKey);
		});

		it("msngr.emit() with topic and category", function (done) {
			var msg = {
				topic: "test2_" + uniqueKey,
				category: "test2Cat_" + uniqueKey
			};
			msngr.register(msg, function () {
				done();
			}, this);

			msngr.emit(msg);
		});

		it("msngr.emit() with topic, category and dataType", function (done) {
			var msg = {
				topic: "test3_" + uniqueKey,
				category: "test3Cat_" + uniqueKey,
				dataType: "test3Type_" + uniqueKey
			};
			msngr.register(msg, function () {
				done();
			}, this);

			msngr.emit(msg);
		});

		it("msngr.emit() with topic and partial, matching category", function (done) {
			var msg = {
				topic: "test4_" + uniqueKey,
				category: "test4Cat_" + uniqueKey + "*"
			};
			msngr.register(msg, function () {
				done();
			}, this);

			msngr.emit({
				topic: msg.topic,
				category: "test4Cat_" + uniqueKey + "test"
			});
		});

		it("msngr.emit() with topic, category and partial, matching dataType", function (done) {
			var msg = {
				topic: "test5_" + uniqueKey,
				category: "test5Cat_" + uniqueKey,
				dataType: "test5Type_" + uniqueKey + "*"
			};
			msngr.register(msg, function () {
				done();
			}, this);

			msngr.emit({
				topic: msg.topic,
				category: "test5Cat_" + uniqueKey,
				dataType: "test5Type_" + uniqueKey + "test"
			});
		});

		it("msngr.register() throws", function () {
			expect(msngr.register).throws();
		});

		it("msngr.unregister() removes", function () {
			var method = msngr.register("test100_" + uniqueKey, function () {
				throw "test failure";
			}, this);
			expect(method).to.not.equal(undefined);
			msngr.unregister(method);
			msngr.emit("test100_" + uniqueKey);
		});
	});
});
tests("msngr", (typeof window !== "undefined") ? msngr : require("../msngr.js"), Math.floor(Math.random() * 1000));
