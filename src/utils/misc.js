msngr.extend((function () {
	"use strict";

	var idsUsed = { };

	return {
		utils: {
			id: function () {
				var ms = Date.now();
				var rand = Math.floor(((Math.random() + 1) * 10000));
				var i = ms + "-" + rand;

				if (idsUsed[i] !== undefined) {
					return msngr.utils.id();
				}

				idsUsed[i] = 0;
				return i;
			}
		}
	};
}()));
