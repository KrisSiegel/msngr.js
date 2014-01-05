msngr.extend((function () {
	var routers = [];
	return {
		registry: {
			route: function (message, callback) {
				for (var i = 0; i < routers.length; ++i) {
					routers[i].route(message, callback);
				}
			},
			add: function (router) {
				routers.push(router);
				return this;
			},
			get: function (index) {
				return routers[index];
			},
			count: function () {
				return routers.length;
			},
			remove: function (index) {
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
