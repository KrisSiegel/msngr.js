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

		var keys = msngr.utils.indexer.query(message);
		if (keys.count > 0) {
			for (var key in keys.items) {
				if (keys.items.hasOwnProperty(key)) {
					executeReceiver(receivers[key].callback, receivers[key].context, [message.payload]);
				}
			}
		}
	};

	var handleReceiverRegistration = function (message, callback, context) {
		var id = msngr.utils.id();
		receivers[id] = {
			message: message,
			callback: callback,
			context: context,
			fk: id
		};
		msngr.utils.indexer.index(message, id);
		receiverCount++;
		return id;
	};

	var handleReceiverRemoval = function (fk) {
		msngr.utils.indexer.remove(fk);
		delete receivers[fk];
	};

	return {
		scope: "local",
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
