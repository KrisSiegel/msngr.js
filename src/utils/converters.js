msngr.extend((function () {
	"use strict";

	return {
		utils: {
			argumentsToArray: function (args) {
				if (msngr.utils.isArray(args)) {
					return args;
				}

				return Array.prototype.slice.call(args, 0);
			}
		}
	};
}()));
