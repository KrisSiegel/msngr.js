msngr.extend((function () {
	return {
		interfaces: {
			router: {
				route: function (message, callback) {
					msngr.utils.ThrowNotImplementedException();
				},
				pause: function () {
					msngr.utils.ThrowNotImplementedException();
				},
				start: function () {
					msngr.utils.ThrowNotImplementedException();
				}
			}
		}
	};
}()));