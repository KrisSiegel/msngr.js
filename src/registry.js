msngr.extend((function () {
	var routers = [];
	return {
		registry: {
			route: function (message, callback) {
				if (message === undefined) {
					msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
				}
				for (var i = 0; i < routers.length; ++i) {
					routers[i].route(message, callback);
				}
			},
			add: function (router) {
				if (router === undefined) {
					msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("router");
				}
				if (msngr.utils.ensureInterface(router, msngr.interfaces.router)) {
					routers.push(router);
					return this;
				} else {
					msngr.utils.ThrowMismatchedInterfaceException("router");
				}
			},
			get: function (index) {
				if (index === undefined) {
					msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("index");
				}
				return routers[index];
			},
			count: function () {
				return routers.length;
			},
			remove: function (index) {
				if (index === undefined) {
					msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("index");
				}
				// This is faster than splice if we have a lot of items and we're not at the end
				var endIndex = routers.length -1;
	            if (index !== endIndex) {
	                var temp = routers[endIndex];
	                routers[endIndex] = routers[index];
	                routers[index] = temp;
	            }
	            routers.pop();
			}
		}
	};
}()));
