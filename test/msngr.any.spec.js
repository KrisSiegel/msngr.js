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
			assert.notEqual(msngr, undefined);
		});

		it("msngr.extend()", function () {
			// Check that extend exists
			assert.notEqual(msngr.extend, undefined);
			// Ensure that the method we're adding doesn't exist
			assert.equal(msngr.test_extend, undefined);
			// Extend msngr with new method
			msngr.extend({
				test_extend: function () {

				}
			});
			// Ensure new method now exists
			assert.notEqual(msngr.test_extend, undefined);
			// Drop new method
			delete msngr.test_extend;
			// Ensure new method is gone again
			assert.equal(msngr.test_extend, undefined);

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
			assert.equal(msngr.test_extend.test, msngr.test_extend.another);
			assert.notEqual(msngr.test_extend.test, msngr.test);
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
			assert.equal(obj.testing.tests.length > 0, true);
			assert.equal(obj.testing.tests.length === 4, true);
			assert.equal(obj.another.length > 0, true);
			assert.equal(msngr.utils.getType(obj.testing.tests), "[object Array]");
			assert.equal(msngr.utils.getType(obj.another), "[object Array]");
		});

		it("msngr.send() throws", function (done) {
			assert.throws(msngr.send);
			done();
		});

		it("msngr.send() with topic", function (done) {
			msngr.receive("test_" + uniqueKey, function () {
				done();
			}, this);
			msngr.send("test_" + uniqueKey);
		});

		it("msngr.send() with topic and category", function (done) {
			var msg = {
				topic: "test2_" + uniqueKey,
				category: "test2Cat_" + uniqueKey
			};
			msngr.receive(msg, function () {
				done();
			}, this);

			msngr.send(msg);
		});

		it("msngr.send() with topic, category and dataType", function (done) {
			var msg = {
				topic: "test3_" + uniqueKey,
				category: "test3Cat_" + uniqueKey,
				dataType: "test3Type_" + uniqueKey
			};
			msngr.receive(msg, function () {
				done();
			}, this);

			msngr.send(msg);
		});

		it("msngr.send() with topic and partial, matching category", function (done) {
			var msg = {
				topic: "test4_" + uniqueKey,
				category: "test4Cat_" + uniqueKey + "*"
			};
			msngr.receive(msg, function () {
				done();
			}, this);

			msngr.send({
				topic: msg.topic,
				category: "test4Cat_" + uniqueKey + "test"
			});
		});

		it("msngr.send() with topic, category and partial, matching dataType", function (done) {
			var msg = {
				topic: "test5_" + uniqueKey,
				category: "test5Cat_" + uniqueKey,
				dataType: "test5Type_" + uniqueKey + "*"
			};
			msngr.receive(msg, function () {
				done();
			}, this);

			msngr.send({
				topic: msg.topic,
				category: "test5Cat_" + uniqueKey,
				dataType: "test5Type_" + uniqueKey + "test"
			});
		});

		it("msngr.sendSync() throws", function () {
			assert.throws(msngr.sendSync);
		});

		it("msngr.sendSync() with topic", function () {
			msngr.receive("test99_" + uniqueKey, function () {
			}, this);
			msngr.sendSync("test99_" + uniqueKey);
		});

		it("msngr.receive() throws", function () {
			assert.throws(msngr.receive);
		});
	});
});
tests("msngr", (typeof window !== "undefined") ? msngr : require("../msngr.js"), Math.floor(Math.random() * 1000));
