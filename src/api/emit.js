msngr.extend((function () {
	return {
		emit: function (message, context) {
			if (!msngr.utils.isValidMessage(message)) {
				msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
			}

			for (var i = 0; i < msngr.registry.routers.count(); ++i) {
				msngr.registry.routers.get(i).emit(msngr.utils.ensureMessage(message), context);
			}
		}
	};
}()));
