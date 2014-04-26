msngr.registry.add((function () {
	var receivers = [];

	var states = {
		running: "RUNNING",
		paused: "PAUSED",
		stopped: "STOPPED"
	};
	var state = states.running;

	var queue = [];

	var executeReceiverSync = function (method, context, params) {
		method.apply(context, params);
	};

	var executeReceiver = function (method, context, params) {
		setTimeout(function () {
			executeReceiverSync(method, context, params);
		}, 0);
	};

	var handleSend = function (message, callback, context) {
		if (!msngr.utils.isValidMessage(message)) {
			msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
		}

		var indexesToExecute = [];
		for (var i = 0; i < receivers.length; ++i) {
			if (msngr.utils.isMessageMatch(message, receivers[i].message)) {
				executeReceiver(receivers[i].callback, receivers[i].context, [message.payload]);
			}
		}


		if (indexesToExecute.length > 0) {
			executeReceivers(indexesToExecute);
		}
	};

	var handleReceiverRegistration = function (message, callback, context) {
		receivers.push({
			message: message,
			callback: callback,
			context: context
		});
	};

	return {
		send: function (message, callback, context) {
			if (!msngr.utils.isValidMessage(message)) {
				msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
			}
			handleSend(message, callback, (context || this));
			return this;
		},
		receive: function (message, callback, context) {
			if (!msngr.utils.isValidMessage(message)) {
				msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
			}
			handleReceiverRegistration(message, callback, (context || this));
			return this;
		}
	};
}()));
