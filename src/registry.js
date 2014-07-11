msngr.extend((function () {
	var registered = {
		routers: [],
		binders: []
	};

	var add = function (item, type) {
		if (item === undefined) {
			msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("item");
		}
		
		if (msngr.utils.verifyInterface(item, msngr.interfaces[type])) {
			registered[type].push(item);
		} else {
			msngr.utils.ThrowMismatchedInterfaceException(type);
		}
	};

	var get = function (index, type) {
		if (index === undefined) {
			msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("index");
		}
		return registered[type][index];
	};

	var count = function (type) {
		return registered[type].length;
	};

	var remove = function (index, type) {
		if (index === undefined) {
			msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("index");
		}

		// This is faster than splice if we have a lot of items and we're not at the end
		var endIndex = registered[type].length -1;
		if (index !== endIndex) {
			var temp = registered[type][endIndex];
			registered[type][endIndex] = registered[type][index];
			registered[type][index] = temp;
		}
		registered[type].pop();
		return this;
	}

	return {
		registry: {
			routers: {
				add: function (router) {
					return add(router, "routers");
				},
				get: function (index) {
					return get(index, "routers");
				},
				count: function () {
					return count("routers");
				},
				remove: function (index) {
					return remove(index, "routers");
				}
			},
			binders: {
				add: function (binder) {
					return add(binder, "binders");
				},
				get: function (index) {
					return get(index, "binders");
				},
				count: function () {
					return count("binders");
				},
				remove: function (index) {
					return remove(index, "binders");
				}
			}
		}
	};
}()));
