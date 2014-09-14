msngr.extend((function () {
	var idsUsed = { };

	return {
		utils: {
			arrayContains: function (arr, values) {
				if (msngr.utils.isNullOrUndefined(arr)) {
					return false;
				}

				if (!msngr.utils.isArray(values)) {
					values = [values];
				}

				for (var i = 0; i < values.length; ++i) {
					if (arr.indexOf(values[i]) === -1) {
						return false;
					}
				}
				return true;
			},
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
	}
}()));
