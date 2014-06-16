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

	var handleSend = function (message, callback, context, sync) {
		if (!msngr.utils.isValidMessage(message)) {
			msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
		}

		var keys = msngr.utils.indexer.query(message);
		for (var i = 0; i < keys.length; ++i) {
			if (sync === true) {
				executeReceiverSync(receivers[keys[i]].callback, receivers[keys[i]].context, [message.payload]);
			} else {
				executeReceiver(receivers[keys[i]].callback, receivers[keys[i]].context, [message.payload]);
			}
		}
	};

	var handleReceiverRegistration = function (message, callback, context) {
		receivers[callback] = {
			message: message,
			callback: callback,
			context: context
		};
		msngr.utils.indexer.index(message, callback);
		receiverCount++;
		return callback;
	};

	var handleReceiverRemoval = function (receiver) {
		msngr.utils.indexer.remove(receiver);
		delete receivers[receiver];
	};

	return {
		send: function (message, callback, context) {
			if (!msngr.utils.isValidMessage(message)) {
				msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
			}
			return handleSend(message, callback, (context || this), false);
		},
		sendSync: function (message, callback, context) {
			if (!msngr.utils.isValidMessage(message)) {
				msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
			}
			return handleSend(message, callback, (context || this), true);
		},
		receive: function (message, callback, context) {
			if (!msngr.utils.isValidMessage(message)) {
				msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
			}
			return handleReceiverRegistration(message, callback, (context || this));
		},
		remove: function (receiver) {
			if (msngr.utils.isNullOrUndefined(receiver)) {
				msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("receiver");
			}
			return handleReceiverRemoval(receiver);
		}
	};
}()));
