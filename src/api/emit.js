msngr.extend((function () {
	return {
		emit: function (message, context) {
			if (!msngr.utils.isValidMessage(message)) {
				msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
			}

			var msg = msngr.utils.ensureMessage(message);

			for (var i = 0; i < msngr.registry.routers.count(); ++i) {
				var router = msngr.registry.routers.get(i);
				if (msngr.utils.isNullOrUndefined(msg.domain)) {
					msg.domain = "local";
				}
				if (msg.domain === router.domain || msg.domain === "localAndRemote") {
					router.emit(msg, context);
				}
			}
		}
	};
}()));
