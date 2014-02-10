msngr.registry.add((function () {
	var receivers = [];
	var receiversInverseIndex = {
		topic: { },
		category: { },
		dataType: { },
		target: { }
	};
	var receiversPartialMatchesIndex = [];

	var states = {
		running: "RUNNING",
		paused: "PAUSED",
		stopped: "STOPPED"
	};
	var state = states.running;

	var queue = [];

	var handleStateChange = function () {
		
	};

	var executeReceivers = function(indexes, payload) {
		for (var i = 0; i < indexes.length; ++i) {
			receivers[indexes[i]].callback.apply(receivers[indexes[i]].context, [payload]);
		}
	};

	var executeReceiversAsync = function (indexes, payload) {
		(function (i, p) {
			setTimeout(function () {
				executeReceivers(i, p);
			}, 0);
		}(indexes, payload));
	};

	var handleSend = function (message, callback, context) {
		var indexesToExecute = [];
		if (msngr.utils.doesMessageContainWildcard(message)) {
			for (var i = 0; i < receiversPartialMatchesIndex.length; ++i) {
				var msg = receivers[receiversPartialMatchesIndex[i]];
				if (msngr.utils.isMessageMatch(message, msg)) {
					indexesToExecute.push(receiversPartialMatchesIndex[i]);
				}
			}
		} else {
			// We have indexes but this is stupid;
			// TODO: Properly use the indexes. Dummy.
			var matches = queryIndex(message, "topic") || [];
			matches = matches.concat(queryIndex(message, "category") || []);
			matches = matches.concat(queryIndex(message, "dataType") || []);
			matches = matches.concat(queryIndex(message, "target") || []);
			matches = matches.filter(function (v, i, a) { return a.indexOf (v) == i });

			for (var i = 0; i < matches.length; ++i) {
				var msg = receivers[matches[i]];
				if (msngr.utils.isMessageMatch(message, msg)) {
					indexesToExecute.push(matches[i]);
				}
			}
		}

		if (indexesToExecute.length > 0) {
			executeReceiversAsync(indexesToExecute);
		}
	};

	var indexMessage = function (message, field, index) {
		if (!msngr.utils.isNullOrUndefined(message[field])) {
			if (receiversInverseIndex[field][message[field]] === undefined) {
				receiversInverseIndex[field][message[field]] = [];
			}
			receiversInverseIndex[field][message[field]].push(index);
		}
	};

	var queryIndex = function (message, field) {
		if (!msngr.utils.isNullOrUndefined(receiversInverseIndex[field]) && !msngr.utils.isNullOrUndefined(receiversInverseIndex[field][message[field]])) {
			return receiversInverseIndex[field][message[field]];
		}
	};

	var handleReceiverRegistration = function (message, callback, context) {
		var index = receivers.push({
			message: message,
			callback: callback,
			context: context
		});

		index -= 1;

		if (msngr.utils.doesMessageContainWildcard(message)) {
			receiversPartialMatchesIndex.push(index);
		} else {
			indexMessage(message, "topic", index);
			indexMessage(message, "dataType", index);
			indexMessage(message, "category", index);
			indexMessage(message, "target", index);
		}
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
		},
		start: function () {
			state = states.running;
			handleStateChange();
			return this;
		},
		pause: function () {
			state = states.paused;
			handleStateChange();
			return this;
		},
		stop: function () {
			state = states.stopped();
			handleStateChange();
			return this;
		}
	};
}()));
