var msngr = msngr || (function () {
	return {
		extend: function (obj, target) {
			target = (target || msngr);
			if (Object.prototype.toString.call(obj) === "[object Object]") {
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						if (Object.prototype.toString.call(obj[key]) === "[object Object]") {
							target[key] = msngr.extend(obj[key], { });
						} else {
							target[key] = obj[key];
						}
					}
				}
			}
			return target;
		}
	};
}());
