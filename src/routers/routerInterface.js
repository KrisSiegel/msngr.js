msngr.extend((function () {
	return {
		interfaces: {
			router: {
				route: function (message, callback, context) {
					msngr.utils.ThrowNotImplementedException();
				},
				pause: function () {
					msngr.utils.ThrowNotImplementedException();
				},
				start: function () {
					msngr.utils.ThrowNotImplementedException();
				},
				stop: function () {
					msngr.utils.ThrowNotImplementedException();
				}
			}
		}
	};
}()));