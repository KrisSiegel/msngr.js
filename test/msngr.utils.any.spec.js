if (typeof assert === "undefined" && typeof window === "undefined") {
	var assert = require("assert");
}
if (typeof chai === "undefined" && typeof window === "undefined") {
	var chai = require("chai");
}

var expect = chai.expect;

var tests = (function (description, msngr, uniqueKey) {
	describe(description, function () {
		it("msngr.utils.isNullOrUndefined(obj)", function () {
			expect(msngr.utils.isNullOrUndefined("test")).to.equal(false);
			expect(msngr.utils.isNullOrUndefined("")).to.equal(false);
			expect(msngr.utils.isNullOrUndefined(undefined)).to.equal(true);
			expect(msngr.utils.isNullOrUndefined(null)).to.equal(true);
			expect(msngr.utils.isNullOrUndefined({})).to.equal(false);
			expect(msngr.utils.isNullOrUndefined(7)).to.equal(false);
			expect(msngr.utils.isNullOrUndefined([])).to.equal(false);
			expect(msngr.utils.isNullOrUndefined(new Date())).to.equal(false);
			expect(msngr.utils.isNullOrUndefined(function () {})).to.equal(false);
		});

		it("msngr.utils.isString(obj)", function () {
			expect(msngr.utils.isString("test")).to.equal(true);
			expect(msngr.utils.isString("")).to.equal(true);
			expect(msngr.utils.isString(undefined)).to.equal(false);
			expect(msngr.utils.isString(null)).to.equal(false);
			expect(msngr.utils.isString({})).to.equal(false);
			expect(msngr.utils.isString(7)).to.equal(false);
			expect(msngr.utils.isString([])).to.equal(false);
			expect(msngr.utils.isString(new Date())).to.equal(false);
			expect(msngr.utils.isString(function () {})).to.equal(false);
		});

		it("msngr.utils.isObject(obj)", function () {
			expect(msngr.utils.isObject("test")).to.equal(false);
			expect(msngr.utils.isObject("")).to.equal(false);
			expect(msngr.utils.isObject(undefined)).to.equal(false);
			expect(msngr.utils.isObject(null)).to.equal(false);
			expect(msngr.utils.isObject({})).to.equal(true);
			expect(msngr.utils.isObject(7)).to.equal(false);
			expect(msngr.utils.isObject([])).to.equal(false);
			expect(msngr.utils.isObject(new Date())).to.equal(false);
			expect(msngr.utils.isObject(function () {})).to.equal(false);
		});

		it("msngr.utils.isNumber(obj)", function () {
			expect(msngr.utils.isNumber("test")).to.equal(false);
			expect(msngr.utils.isNumber("")).to.equal(false);
			expect(msngr.utils.isNumber(undefined)).to.equal(false);
			expect(msngr.utils.isNumber(null)).to.equal(false);
			expect(msngr.utils.isNumber({})).to.equal(false);
			expect(msngr.utils.isNumber(7)).to.equal(true);
			expect(msngr.utils.isNumber([])).to.equal(false);
			expect(msngr.utils.isNumber(new Date())).to.equal(false);
			expect(msngr.utils.isNumber(function () {})).to.equal(false);
		});

		it("msngr.utils.isDate(obj)", function () {
			expect(msngr.utils.isDate("test")).to.equal(false);
			expect(msngr.utils.isDate("")).to.equal(false);
			expect(msngr.utils.isDate(undefined)).to.equal(false);
			expect(msngr.utils.isDate(null)).to.equal(false);
			expect(msngr.utils.isDate({})).to.equal(false);
			expect(msngr.utils.isDate(7)).to.equal(false);
			expect(msngr.utils.isDate([])).to.equal(false);
			expect(msngr.utils.isDate(new Date())).to.equal(true);
			expect(msngr.utils.isDate(function () {})).to.equal(false);
		});

		it("msngr.utils.isFunction(obj)", function () {
			expect(msngr.utils.isFunction(function () {})).to.equal(true);
			expect(msngr.utils.isFunction("test")).to.equal(false);
			expect(msngr.utils.isFunction("")).to.equal(false);
			expect(msngr.utils.isFunction(undefined)).to.equal(false);
			expect(msngr.utils.isFunction(null)).to.equal(false);
			expect(msngr.utils.isFunction({})).to.equal(false);
			expect(msngr.utils.isFunction(7)).to.equal(false);
			expect(msngr.utils.isFunction([])).to.equal(false);
			expect(msngr.utils.isFunction(new Date())).to.equal(false);
		});

		it("msngr.utils.isArray(obj)", function () {
			expect(msngr.utils.isArray(function () {})).to.equal(false);
			expect(msngr.utils.isArray("test")).to.equal(false);
			expect(msngr.utils.isArray("")).to.equal(false);
			expect(msngr.utils.isArray(undefined)).to.equal(false);
			expect(msngr.utils.isArray(null)).to.equal(false);
			expect(msngr.utils.isArray({})).to.equal(false);
			expect(msngr.utils.isArray(7)).to.equal(false);
			expect(msngr.utils.isArray(new Date())).to.equal(false);
			expect(msngr.utils.isArray(new Array)).to.equal(true);
			expect(msngr.utils.isArray([])).to.equal(true);
			expect(msngr.utils.isArray([1,2,3,4,5])).to.equal(true);
		});

		it("msngr.utils.getType(obj)", function () {
			expect(msngr.utils.getType(function () {})).to.equal("[object Function]");
			expect(msngr.utils.getType("test")).to.equal("[object String]");
		});

		it("msngr.utils.isEmptyString(str)", function () {
			expect(msngr.utils.isEmptyString(function () {})).to.equal(false);
			expect(msngr.utils.isEmptyString("test")).to.equal(false);
			expect(msngr.utils.isEmptyString("")).to.equal(true);
			expect(msngr.utils.isEmptyString(undefined)).to.equal(true);
			expect(msngr.utils.isEmptyString(null)).to.equal(true);
			expect(msngr.utils.isEmptyString({})).to.equal(false);
			expect(msngr.utils.isEmptyString(7)).to.equal(false);
			expect(msngr.utils.isEmptyString([])).to.equal(false);
			expect(msngr.utils.isEmptyString(new Date())).to.equal(false);
		});

		it("msngr.utils.ThrowNotImplementedException()", function () {
			expect(msngr.utils.ThrowNotImplementedException).to.throw();
		});

		it("msngr.utils.ThrowRequiredParameterMissingOrUndefinedException()", function () {
			expect(msngr.utils.ThrowRequiredParameterMissingOrUndefinedException).to.throw();
		});

		it("msngr.utils.ThrowMismatchedInterfaceException()", function () {
			expect(msngr.utils.ThrowMismatchedInterfaceException).to.throw();
		});

		it("msngr.utils.arrayContains()", function () {
			expect(msngr.utils.arrayContains([1,2,3], 2)).to.equal(true);
			expect(msngr.utils.arrayContains([1,2,3], 0)).to.equal(false);
			expect(msngr.utils.arrayContains([1,2,3], [1,2])).to.equal(true);
			expect(msngr.utils.arrayContains([1,2,3], [0,1])).to.equal(false);
		});

		it("msngr.utils.ensureMessage(message)", function () {
			expect(msngr.utils.ensureMessage("MyTopic").topic, "MyTopic");
			expect(msngr.utils.ensureMessage({ topic: "MyTopic" }).topic, "MyTopic");
		});

		it("msngr.utils.doesMessageContainWildcard()", function () {
			expect(msngr.utils.doesMessageContainWildcard("Topic")).to.equal(false);
			expect(msngr.utils.doesMessageContainWildcard("Topic*")).to.equal(true);
			expect(msngr.utils.doesMessageContainWildcard({
				topic: "Test",
				category: "Test*"
			})).to.equal(true);
			expect(msngr.utils.doesMessageContainWildcard({
				topic: "Test",
				category: "Test"
			})).to.equal(false);
			expect(msngr.utils.doesMessageContainWildcard({
				topic: "Test",
				category: "Test",
				dataType: "Test*"
			})).to.equal(true);
			expect(msngr.utils.doesMessageContainWildcard({
				topic: "*",
				category: "Test",
				dataType: "Test"
			})).to.equal(true);
			expect(msngr.utils.doesMessageContainWildcard({
				topic: "Test",
				category: "*",
				dataType: "Test"
			})).to.equal(true);
			expect(msngr.utils.doesMessageContainWildcard({
				topic: "Test",
				category: "Test",
				dataType: "*"
			})).to.equal(true);
			expect(msngr.utils.doesMessageContainWildcard({
				topic: "Test",
				category: "Test",
				dataType: "Test"
			})).to.equal(false);
		});

		it("msngr.utils.isWildCardStringMatch", function () {
			expect(msngr.utils.isWildCardStringMatch("test", "test")).to.equal(true);
			expect(msngr.utils.isWildCardStringMatch("*", "test")).to.equal(true);
			expect(msngr.utils.isWildCardStringMatch("test", "*")).to.equal(true);
			expect(msngr.utils.isWildCardStringMatch(undefined, "test")).to.equal(true);
			expect(msngr.utils.isWildCardStringMatch("test", undefined)).to.equal(true);
			expect(msngr.utils.isWildCardStringMatch(null, "test")).to.equal(true);
			expect(msngr.utils.isWildCardStringMatch("test", null)).to.equal(true);
			expect(msngr.utils.isWildCardStringMatch("te*t", "test")).to.equal(true);
			expect(msngr.utils.isWildCardStringMatch("test", "te*t")).to.equal(true);
			expect(msngr.utils.isWildCardStringMatch("te*", "test")).to.equal(true);
			expect(msngr.utils.isWildCardStringMatch("test", "te*")).to.equal(true);
			expect(msngr.utils.isWildCardStringMatch("", "test")).to.equal(true);
			expect(msngr.utils.isWildCardStringMatch("test", "")).to.equal(true);
			expect(msngr.utils.isWildCardStringMatch("*", "test")).to.equal(true);
			expect(msngr.utils.isWildCardStringMatch("test", "*")).to.equal(true);
			expect(msngr.utils.isWildCardStringMatch("TEST", "test")).to.equal(true);
			expect(msngr.utils.isWildCardStringMatch("test", "TEST")).to.equal(true);

			expect(msngr.utils.isWildCardStringMatch("tes*", "snap")).to.equal(false);
			expect(msngr.utils.isWildCardStringMatch(7, "snap")).to.equal(false);
			expect(msngr.utils.isWildCardStringMatch("snap", 14)).to.equal(false);
			expect(msngr.utils.isWildCardStringMatch("test", { })).to.equal(false);
			expect(msngr.utils.isWildCardStringMatch(undefined, {})).to.equal(false);
			expect(msngr.utils.isWildCardStringMatch("*", function () {})).to.equal(false);
		});

		it("msngr.utils.isValidMessage(message)", function () {
			expect(msngr.utils.isValidMessage({
				topic: "Test"
			})).to.equal(true);

			expect(msngr.utils.isValidMessage({
				topic: "Testing",
				category: "MyCategory"
			})).to.equal(true);

			expect(msngr.utils.isValidMessage({
				topic: "Testing",
				category: "MyCategory",
				dataType: "application/json"
			})).to.equal(true);

			expect(msngr.utils.isValidMessage({
				topic: "Testing",
				dataType: "application/json"
			})).to.equal(true);

			expect(msngr.utils.isValidMessage({
				topic: "*"
			})).to.equal(true);

			expect(msngr.utils.isValidMessage({
				topic: "Save",
				category: "Category*",
				dataType: "application/*"
			})).to.equal(true);

			expect(msngr.utils.isValidMessage({
				topic: "Testing",
				target: "550e8400-e29b-41d4-a716-446655440000"
			})).to.equal(true);

			expect(msngr.utils.isValidMessage("MyTopic")).to.equal(true);

			expect(msngr.utils.isValidMessage(undefined)).to.equal(false);

			expect(msngr.utils.isValidMessage(null)).to.equal(false);

			expect(msngr.utils.isValidMessage("")).to.equal(false);

			expect(msngr.utils.isValidMessage({
				category: "MyCat"
			})).to.equal(false);

			expect(msngr.utils.isValidMessage({
				topic: function () { }
			})).to.equal(false);

			expect(msngr.utils.isValidMessage({
				topic: "test",
				category: function () { }
			})).to.equal(false);
		});

		it("msngr.utils.isMessageMatch(sent, target)", function () {
			expect(msngr.utils.isMessageMatch({
					topic: "test"
				}, {
					topic: "test"
				})).to.equal(true);

			expect(msngr.utils.isMessageMatch({
					topic: "test"
				}, {
					topic: "*"
				})).to.equal(true);

			expect(msngr.utils.isMessageMatch({
					topic: "test",
					category: "Yup"
				}, {
					topic: "test",
					category: "yup"
				})).to.equal(true);

			expect(msngr.utils.isMessageMatch({
					topic: "test",
					dataType: "application/json"
				}, {
					topic: "test",
					dataType: "application/*"
				})).to.equal(true);

			expect(msngr.utils.isMessageMatch({
					topic: "test"
				}, {
					topic: "no"
				})).to.equal(false);

			expect(msngr.utils.isMessageMatch({
					topic: "test",
					dataType: "application/json"
				}, {
					topic: "test",
					dataType: "document"
				})).to.equal(false);

			expect(msngr.utils.isMessageMatch({
					topic: "test",
					category: "document"
				}, {
					topic: "no",
					category: "a*"
				})).to.equal(false);
		});

		it("msngr.utils.getPropertiesWithWildcards", function () {
			expect(msngr.utils.getPropertiesWithWildcards({ topic: "test", category: "cat*" }).length).to.equal(1);
			expect(msngr.utils.getPropertiesWithWildcards({ topic: "test*", category: "cat*" }).length).to.equal(2);
			expect(msngr.utils.getPropertiesWithWildcards({ topic: "test", category: "cat*", dataType: "type" }).length).to.equal(1);
			expect(msngr.utils.getPropertiesWithWildcards({ topic: "test*", category: "cat*", dataType: "type*" }).length).to.equal(3);
		});

		it("msngr.utils.indexer.index", function () {
			msngr.utils.indexer.index({
				topic: "test1555_" + uniqueKey
			}, "skjdsd" + uniqueKey);
			msngr.utils.indexer.index({
				topic: "test2555_" + uniqueKey,
				category: "sdfsdg"
			}, "skjdsdfd" + uniqueKey);
			msngr.utils.indexer.index({
				topic: "test4555_" + uniqueKey,
				category: "ncvx",
				dataType: "sdlajdasd"
			}, "skjfhfhdsd" + uniqueKey);
		});
	});
});
tests("msngr.utils", (typeof window !== "undefined") ? msngr : require("../msngr.js"), Math.floor(Math.random() * 1000));
