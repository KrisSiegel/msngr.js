msngr.extend((function () {
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
			}
		}
	}
}()));