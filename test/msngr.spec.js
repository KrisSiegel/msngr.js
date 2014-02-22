var tests = (function (description, msngr, uniqueKey) {
	var assert = require("assert");
	
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
					console.log("test");
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
					test: "yes"
				}
			});
			assert.equal(obj.testing.tests.length > 0, true);
			assert.equal(obj.another.length > 0, true);
			assert.equal(msngr.utils.getType(obj.testing.tests), "[object Array]");
			assert.equal(msngr.utils.getType(obj.another), "[object Array]");
		});

		it("msngr.send()", function (done) {
			assert.throws(msngr.send);
			msngr.receive("test_" + uniqueKey, function () { 
				done();
			}, this );
			msngr.send("test_" + uniqueKey);
		});

		it("msngr.receive()", function () {
			assert.throws(msngr.receive);
		});
	});
});
tests("[Concatenated] msngr", require("../msngr.js"), Math.floor(Math.random() * 1000));
tests("[Minified] msngr", require("../msngr.js"), Math.floor(Math.random() * 1000))	;
