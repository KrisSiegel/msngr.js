msngr.extend((function (external, internal) {
	"use strict";

	return {
		argumentsToArray: function (args) {
			if (external.isArray(args)) {
				return args;
			}
			if (external.isArguments(args)) {
				return Array.prototype.slice.call(args, 0);
			}
			return [args];
		}
	};
}));
