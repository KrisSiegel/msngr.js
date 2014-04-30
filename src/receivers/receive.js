msngr.extend((function () {

	return {
		receive: function (message, callback, context) {
			if (!msngr.utils.isValidMessage(message)) {
				msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
			}

			for (var i = 0; i < msngr.registry.routers.count(); ++i) {
				msngr.registry.routers.get(i).receive(msngr.utils.ensureMessage(message), callback, context);
			}
		}
	};
}()));
