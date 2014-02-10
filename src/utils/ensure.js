msngr.extend((function () {
	return {
		utils: {
			ensureMessage: function (message) {
				if (!msngr.utils.isNullOrUndefined(message)) {
					if (msngr.utils.isString(message) && !msngr.utils.isEmptyString(message)) {
						return {
							topic: message
						};
					}
					return message;
				}
				return undefined;
			}
		}
	}
}()));