msngr.registry.routers.add((function () {
	// receivers should be an object versus array for better efficiencies
	// when deleting items.
	var receivers = { };
	var receiverCount = 0;

	var executeReceiverSync = function (method, context, params) {
		method.apply(context, params);
	};

	var executeReceiver = function (method, context, params) {
		(function (m, c, p) {
			setTimeout(function () {
				executeReceiverSync(m, c, p);
			}, 0);
		}(method, context, params));
	};

	var handleEmit = function (message) {
		if (!msngr.utils.isValidMessage(message)) {
			msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
		}

		var keys = msngr.utils.deprecatedIndexer.query(message);
		for (var i = 0; i < keys.length; ++i) {
			executeReceiver(receivers[keys[i]].callback, receivers[keys[i]].context, [message.payload]);
		}
	};

	var handleReceiverRegistration = function (message, callback, context) {
		receivers[callback] = {
			message: message,
			callback: callback,
			context: context
		};
		msngr.utils.deprecatedIndexer.index(message, callback);
		receiverCount++;
		return callback;
	};

	var handleReceiverRemoval = function (receiver) {
		msngr.utils.deprecatedIndexer.remove(receiver);
		delete receivers[receiver];
	};

	return {
		domain: "local",
		emit: function (message) {
			if (!msngr.utils.isValidMessage(message)) {
				msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
			}
			return handleEmit(message);
		},
		register: function (message, callback, context) {
			if (!msngr.utils.isValidMessage(message)) {
				msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
			}
			return handleReceiverRegistration(message, callback, (context || this));
		},
		unregister: function (receiver) {
			if (msngr.utils.isNullOrUndefined(receiver)) {
				msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("receiver");
			}
			return handleReceiverRemoval(receiver);
		}
	};
}()));
