msngr.extend((function () {
	return {
		interfaces: {
			router: {
				send: function (message, callback, context) {
					msngr.utils.ThrowNotImplementedException();
				},
				sendSync: function (message, callback, context) {
					msngr.utils.ThrowNotImplementedException();
				},
				receive: function (message, callback, context) {
					msngr.utils.ThrowNotImplementedException();
				},
				remove: function (idOrMessage, registeredCallback) {
					msngr.utils.ThrowNotImplementedException();
				}
			}
		}
	};
}()));
