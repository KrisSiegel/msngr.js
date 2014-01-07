msngr.registry.add((function () {
	var queue = [];

	var processQueue = function () {
		while (queue.length > 0) {
			var message = queue.shift();
		}
	};
	return {
		route: function (message, callback, context) {
			console.log("Standard router received: " + message);
		},
		start: function () {

		},
		pause: function () {

		},
		stop: function () {
			
		}
	};
}()));
