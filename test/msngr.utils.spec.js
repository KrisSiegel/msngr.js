var tests = (function (description, msngr) {
	var assert = require("assert");
	
	describe(description, function () {
		it("msngr.utils.isNullOrUndefined(obj)", function () {
			assert.equal(msngr.utils.isNullOrUndefined("test"), false);
			assert.equal(msngr.utils.isNullOrUndefined(""), false);
			assert.equal(msngr.utils.isNullOrUndefined(undefined), true);
			assert.equal(msngr.utils.isNullOrUndefined(null), true);
			assert.equal(msngr.utils.isNullOrUndefined({}), false);
			assert.equal(msngr.utils.isNullOrUndefined(7), false);
			assert.equal(msngr.utils.isNullOrUndefined([]), false);
			assert.equal(msngr.utils.isNullOrUndefined(new Date()), false);
			assert.equal(msngr.utils.isNullOrUndefined(function () {}), false);
		});

		it("msngr.utils.isString(obj)", function () {
			assert.equal(msngr.utils.isString("test"), true);
			assert.equal(msngr.utils.isString(""), true);
			assert.equal(msngr.utils.isString(undefined), false);
			assert.equal(msngr.utils.isString(null), false);
			assert.equal(msngr.utils.isString({}), false);
			assert.equal(msngr.utils.isString(7), false);
			assert.equal(msngr.utils.isString([]), false);
			assert.equal(msngr.utils.isString(new Date()), false);
			assert.equal(msngr.utils.isString(function () {}), false);
		});

		it("msngr.utils.isObject(obj)", function () {
			assert.equal(msngr.utils.isObject("test"), false);
			assert.equal(msngr.utils.isObject(""), false);
			assert.equal(msngr.utils.isObject(undefined), false);
			assert.equal(msngr.utils.isObject(null), false);
			assert.equal(msngr.utils.isObject({}), true);
			assert.equal(msngr.utils.isObject(7), false);
			assert.equal(msngr.utils.isObject([]), false);
			assert.equal(msngr.utils.isObject(new Date()), false);
			assert.equal(msngr.utils.isObject(function () {}), false);
		});

		it("msngr.utils.isNumber(obj)", function () {
			assert.equal(msngr.utils.isNumber("test"), false);
			assert.equal(msngr.utils.isNumber(""), false);
			assert.equal(msngr.utils.isNumber(undefined), false);
			assert.equal(msngr.utils.isNumber(null), false);
			assert.equal(msngr.utils.isNumber({}), false);
			assert.equal(msngr.utils.isNumber(7), true);
			assert.equal(msngr.utils.isNumber([]), false);
			assert.equal(msngr.utils.isNumber(new Date()), false);
			assert.equal(msngr.utils.isNumber(function () {}), false);
		});

		it("msngr.utils.isDate(obj)", function () {
			assert.equal(msngr.utils.isDate("test"), false);
			assert.equal(msngr.utils.isDate(""), false);
			assert.equal(msngr.utils.isDate(undefined), false);
			assert.equal(msngr.utils.isDate(null), false);
			assert.equal(msngr.utils.isDate({}), false);
			assert.equal(msngr.utils.isDate(7), false);
			assert.equal(msngr.utils.isDate([]), false);
			assert.equal(msngr.utils.isDate(new Date()), true);
			assert.equal(msngr.utils.isDate(function () {}), false);
		});

		it("msngr.utils.isFunction(obj)", function () {
			assert.equal(msngr.utils.isFunction(function () {}), true);
			assert.equal(msngr.utils.isFunction("test"), false);
			assert.equal(msngr.utils.isFunction(""), false);
			assert.equal(msngr.utils.isFunction(undefined), false);
			assert.equal(msngr.utils.isFunction(null), false);
			assert.equal(msngr.utils.isFunction({}), false);
			assert.equal(msngr.utils.isFunction(7), false);
			assert.equal(msngr.utils.isFunction([]), false);
			assert.equal(msngr.utils.isFunction(new Date()), false);
		});

		it("msngr.utils.isArray(obj)", function () {
			assert.equal(msngr.utils.isArray(function () {}), false);
			assert.equal(msngr.utils.isArray("test"), false);
			assert.equal(msngr.utils.isArray(""), false);
			assert.equal(msngr.utils.isArray(undefined), false);
			assert.equal(msngr.utils.isArray(null), false);
			assert.equal(msngr.utils.isArray({}), false);
			assert.equal(msngr.utils.isArray(7), false);
			assert.equal(msngr.utils.isArray(new Date()), false);
			assert.equal(msngr.utils.isArray(new Array), true);
			assert.equal(msngr.utils.isArray([]), true);
			assert.equal(msngr.utils.isArray([1,2,3,4,5]), true);
		});

		it("msngr.utils.getType(obj)", function () {
			assert.equal(msngr.utils.getType(function () {}), "[object Function]");
			assert.equal(msngr.utils.getType("test"), "[object String]");
		});

		it("msngr.utils.isEmptyString(str)", function () {
			assert.equal(msngr.utils.isEmptyString(function () {}), false);
			assert.equal(msngr.utils.isEmptyString("test"), false);
			assert.equal(msngr.utils.isEmptyString(""), true);
			assert.equal(msngr.utils.isEmptyString(undefined), true);
			assert.equal(msngr.utils.isEmptyString(null), true);
			assert.equal(msngr.utils.isEmptyString({}), false);
			assert.equal(msngr.utils.isEmptyString(7), false);
			assert.equal(msngr.utils.isEmptyString([]), false);
			assert.equal(msngr.utils.isEmptyString(new Date()), false);
		});

		it("msngr.utils.ensureInterface(obj, interface)", function () {
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

		it("msngr.utils.isWildCardStringMatch", function () {
			assert.equal(msngr.utils.isWildCardStringMatch("test", "test"), true);
			assert.equal(msngr.utils.isWildCardStringMatch("*", "test"), true);
			assert.equal(msngr.utils.isWildCardStringMatch("test", "*"), true);
			assert.equal(msngr.utils.isWildCardStringMatch(undefined, "test"), true);
			assert.equal(msngr.utils.isWildCardStringMatch("test", undefined), true);
			assert.equal(msngr.utils.isWildCardStringMatch(null, "test"), true);
			assert.equal(msngr.utils.isWildCardStringMatch("test", null), true);
			assert.equal(msngr.utils.isWildCardStringMatch("te*t", "test"), true);
			assert.equal(msngr.utils.isWildCardStringMatch("test", "te*t"), true);
			assert.equal(msngr.utils.isWildCardStringMatch("te*", "test"), true);
			assert.equal(msngr.utils.isWildCardStringMatch("test", "te*"), true);
			assert.equal(msngr.utils.isWildCardStringMatch("", "test"), true);
			assert.equal(msngr.utils.isWildCardStringMatch("test", ""), true);
			assert.equal(msngr.utils.isWildCardStringMatch("*", "test"), true);
			assert.equal(msngr.utils.isWildCardStringMatch("test", "*"), true);
			assert.equal(msngr.utils.isWildCardStringMatch("TEST", "test"), true);
			assert.equal(msngr.utils.isWildCardStringMatch("test", "TEST"), true);

			assert.equal(msngr.utils.isWildCardStringMatch("tes*", "snap"), false);
			assert.equal(msngr.utils.isWildCardStringMatch(7, "snap"), false);
			assert.equal(msngr.utils.isWildCardStringMatch("snap", 14), false);
			assert.equal(msngr.utils.isWildCardStringMatch("test", { }), false);
			assert.equal(msngr.utils.isWildCardStringMatch(undefined, {}), false);
			assert.equal(msngr.utils.isWildCardStringMatch("*", function () {}), false);
		});

		it("msngr.utils.isValidMessage(message)", function () {
			var test = function (array, expected) {
				for (var i = 0; i < array.length; ++i) {
					assert.equal(msngr.utils.isValidMessage(array[i]), expected);
				}
			};

			var validMessages = [];
			validMessages.push({
				topic: "Test"
			});
			validMessages.push({
				topic: "Testing",
				category: "MyCategory"
			});
			validMessages.push({
				topic: "Testing",
				category: "MyCategory",
				dataType: "application/json"
			});
			validMessages.push({
				topic: "Testing",
				dataType: "application/json"
			});
			validMessages.push({
				topic: "*"
			});
			validMessages.push({
				topic: "Save",
				category: "Category*",
				dataType: "application/*"
			});
			validMessages.push({
				topic: "Testing",
				target: "550e8400-e29b-41d4-a716-446655440000"
			});
			validMessages.push("MyTopic");

			test(validMessages, true);

			var invalidMessages = [];
			invalidMessages.push(undefined);
			invalidMessages.push(null);
			invalidMessages.push("");
			invalidMessages.push({
				category: "MyCat"
			});
			invalidMessages.push({
				topic: function () { }
			});
			invalidMessages.push({
				topic: "test",
				category: function () { }
			});

			test(invalidMessages, false);
		});

		it("msngr.utils.isMessageMatch(sent, target)", function () {
			var shouldMatch = [];
			var shouldNotMatch = [];
			var test = function (array, expected) {
				for (var i = 0; i < array.length; ++i) {
					assert.equal(msngr.utils.isMessageMatch(array[i].sent, array[i].target), expected);
				}
			};

			shouldMatch.push({
				sent: {
					topic: "test"
				}, target: {
					topic: "test"
				}
			});

			shouldMatch.push({
				sent: {
					topic: "test"
				}, target: {
					topic: "*"
				}
			});

			shouldMatch.push({
				sent: {
					topic: "test",
					category: "Yup"
				}, target: {
					topic: "test",
					category: "yup"
				}
			});

			shouldMatch.push({
				sent: {
					topic: "test",
					dataType: "application/json"
				}, target: {
					topic: "test",
					dataType: "application/*"
				}
			});

			test(shouldMatch, true);

			shouldNotMatch.push({
				sent: {
					topic: "test"
				}, target: {
					topic: "no"
				}
			});

			shouldNotMatch.push({
				sent: {
					topic: "test",
					dataType: "application/json"
				}, target: {
					topic: "test",
					dataType: "document"
				}
			});

			shouldNotMatch.push({
				sent: {
					topic: "test",
					category: "document"
				}, target: {
					topic: "no",
					category: "a*"
				}
			});

			test(shouldNotMatch, false);
		});
	});
});
tests("[Concatenated] msngr.utils", require("../msngr.js"));
tests("[Minified] msngr.utils", require("../msngr.js"));

