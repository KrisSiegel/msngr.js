/*
	main.js

	The main entry point for msngr.js. Covers internal and external interface generation,
	versioning (for programmatic access) and the core extend method.
*/
var msngr = msngr || (function () {
	"use strict";

	var internal = { };
	var external = function (topic, category, dataType) {
		return internal.objects.message(topic, category, dataType);
	};

	external.version = "2.0.0";

	external.extend = function (obj, target) {
		target = (target || external);
		if (Object.prototype.toString.call(obj) === "[object Function]") {
			obj = obj.apply(this, [external, internal]);
		}

		if (Object.prototype.toString.call(obj) === "[object Object]") {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (Object.prototype.toString.call(obj[key]) === "[object Object]") {
						if (target[key] === undefined) {
							target[key] = { };
						}
						target[key] = external.extend(obj[key], target[key]);
					} else if (Object.prototype.toString.call(obj[key]) === "[object Array]") {
						target[key] = (target[key] || []).concat(obj[key]);
					} else {
						target[key] = obj[key];
					}
				}
			}
		}
		return target;
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
		}
	});

	return external;
}());
