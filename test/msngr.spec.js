(function () {
	var assert = require("assert");
	var msngr = require("../msngr.js");
	
	describe("msngr.js", function () {
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
		});

		it("msngr.utils.isString()", function () {
			assert.equal(msngr.utils.isString("test"), true);
			assert.equal(msngr.utils.isString(""), true);
			assert.equal(msngr.utils.isString(undefined), false);
			assert.equal(msngr.utils.isString(null), false);
			assert.equal(msngr.utils.isString({}), false);
			assert.equal(msngr.utils.isString(7), false);
			assert.equal(msngr.utils.isString(new Date()), false);
			assert.equal(msngr.utils.isString(function () {}), false);
		});

		it("msngr.utils.isNumber()", function () {
			assert.equal(msngr.utils.isNumber("test"), false);
			assert.equal(msngr.utils.isNumber(""), false);
			assert.equal(msngr.utils.isNumber(undefined), false);
			assert.equal(msngr.utils.isNumber(null), false);
			assert.equal(msngr.utils.isNumber({}), false);
			assert.equal(msngr.utils.isNumber(7), true);
			assert.equal(msngr.utils.isNumber(new Date()), false);
			assert.equal(msngr.utils.isNumber(function () {}), false);
		});

		it("msngr.utils.isDate()", function () {
			assert.equal(msngr.utils.isDate("test"), false);
			assert.equal(msngr.utils.isDate(""), false);
			assert.equal(msngr.utils.isDate(undefined), false);
			assert.equal(msngr.utils.isDate(null), false);
			assert.equal(msngr.utils.isDate({}), false);
			assert.equal(msngr.utils.isDate(7), false);
			assert.equal(msngr.utils.isDate(new Date()), true);
			assert.equal(msngr.utils.isDate(function () {}), false);
		});

		it("msngr.utils.isFunction()", function () {
			assert.equal(msngr.utils.isFunction(function () {}), true);
			assert.equal(msngr.utils.isFunction("test"), false);
			assert.equal(msngr.utils.isFunction(""), false);
			assert.equal(msngr.utils.isFunction(undefined), false);
			assert.equal(msngr.utils.isFunction(null), false);
			assert.equal(msngr.utils.isFunction({}), false);
			assert.equal(msngr.utils.isFunction(7), false);
			assert.equal(msngr.utils.isFunction(new Date()), false);
		});

		it("msngr.utils.getType()", function () {
			assert.equal(msngr.utils.getType(function () {}), "[object Function]");
			assert.equal(msngr.utils.getType("test"), "[object String]");
		});

		it("msngr.utils.ensureInterface()", function () {
			var interface1 = {
				tester: function () {},
				myName: "testing",
				myObj: {

				}
			};

			assert.equal(msngr.utils.ensureInterface({}, interface1), false);
			assert.equal(msngr.utils.ensureInterface({ tester: "test", myName: "testing", myObj: {} }, interface1), false);
			assert.equal(msngr.utils.ensureInterface({ tester: function () {}, myName: {}, myObj: {} }, interface1), false);
			assert.equal(msngr.utils.ensureInterface({ tester: function () {}, myName: "testing", myObj: "again" }, interface1), false);
			assert.equal(msngr.utils.ensureInterface({ tester: function () {}, myName: "testing", myObj: {} }, interface1), true);
		});	
	});
}());
