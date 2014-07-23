msngr.extend((function () {
	return {
		register: function (message, callback, context) {
			if (!msngr.utils.isValidMessage(message)) {
				msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
			}

			var result = [];
			for (var i = 0; i < msngr.registry.routers.count(); ++i) {
				result.push(msngr.registry.routers.get(i).register(msngr.utils.ensureMessage(message), callback, context));
			}

			if (result.length === 1) {
				return result[0];
			}
			return result;
		}
	};
}()));
