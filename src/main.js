/*
	main.js

	The main entry point for msngr.js. Covers internal and external interface generation,
	versioning (for programmatic access) and the core extend method.
*/
var msngr = msngr || (function () {
	"use strict";

	// Defaults for some internal functions
	var internal = {
		warnings: true
	};

	// The main method for msngr uses the message object
	var external = function (topic, category, dataType) {
		return internal.objects.message(topic, category, dataType);
	};

	external.version = "2.0.0";

	// Merge two inputs into one
	var twoMerge = function (input1, input2) {
		if (input1 === undefined || input1 === null) {
			return input2;
		}

		if (input2 === undefined || input2 === null) {
			return input1;
		}

		var result;
		var type1 = Object.prototype.toString.call(input1);
		var type2 = Object.prototype.toString.call(input2);

		if (type1 === "[object Object]" && type2 === "[object Object]") {
			// Object merging time!
			result = { };
			// Copy input1 into result
			for (var key in input1) {
				if (input1.hasOwnProperty(key)) {
					result[key] = input1[key];
				}
			}
			for (var key in input2) {
				if (input2.hasOwnProperty(key)) {
					if (Object.prototype.toString.call(input2[key]) === "[object Object]") {
						if (result[key] === undefined) {
							result[key] = { };
						}
						result[key] = external.merge(input1[key], input2[key]);
					} else if (Object.prototype.toString.call(input1[key]) === "[object Array]" && Object.prototype.toString.call(input2[key]) === "[object Array]") {
						result[key] = (input1[key] || []).concat(input2[key]);
					} else {
						result[key] = input2[key];
					}
				}
			}
			return result;
		}

		if (type1 === "[object String]" && type2 === "[object String]") {
			result = input1 + input2;
			return result;
		}

		if (type1 === "[object Array]" && type2 === "[object Array]") {
			result = input1.concat(input2);
			return result;
		}

		if (type1 === "[object Function]" && type2 === "[object Function]") {
			return (function (i1, i2, args) {
				return function () {
					return external.merge(i1.apply(this, args), i2.apply(this, args));
				};
			}(input1, input2, arguments));
		}

		var similarObjectTypes = ["[object Function]", "[object Object]"];

		if (similarObjectTypes.indexOf(type1) !== -1 && similarObjectTypes.indexOf(type2) !== -1) {
			var method = (type1 === "[object Function]") ? input1 : input2;
			var props = (type1 === "[object Object]") ? input1 : input2;

			if (method !== undefined && props !== undefined) {
				for (var key in props) {
					if (props.hasOwnProperty(key)) {
						method[key] = props[key];
					}
				}
			}
			result = method;
			return result;
		}

		return result;
	};

	external.extend = function (obj, target) {
		target = (target || external);

		if (Object.prototype.toString.call(obj) === "[object Function]") {
			obj = obj.apply(this, [external, internal]);
		}

		target = external.merge(obj, target);

		return target;
	};

	external.merge = function () {
		var result;
		if (arguments.length > 0) {
			for (var i = 0; i < arguments.length; ++i) {
				result = twoMerge(result, arguments[i]);
			}
		}

		return result;
	};

	// Create a debug property to allow explicit exposure to the internal object structure.
	// This should only be used during unit test runs and debugging.
	Object.defineProperty(external, "debug", {
		set: function (value) {
			if (value === true) {
				external.internal = internal;
			} else if (value === false) {
				delete external.internal;
			}
		},
		get: function () {
			return (external.internal !== undefined)
		}
	});

	// This governs warning messages that some methods may spit into the console when warranted (du'h).
	Object.defineProperty(external, "warnings", {
		set: function (value) {
			internal.warnings = value;
		},
		get: function () {
			return internal.warnings;
		}
	});

	return external;
}());
