msngr.extend((function () {
	"use strict";
	
	return {
		utils: {
			argumentsToArray: function (args) {
				return Array.prototype.slice.call(args, 0);
			}
		}
	}
}()));
