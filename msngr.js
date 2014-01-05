var msngr = msngr || (function () {
	return {
		extend: function (obj, target) {
			target = (target || msngr);
			if (Object.prototype.toString.call(obj) === "[object Object]") {
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						if (Object.prototype.toString.call(obj[key]) === "[object Object]") {
							target[key] = msngr.extend(obj[key], target[key]);
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

msngr.extend((function () {

	return {
		utils: {
			ensureInterface: function (object, interface) {
				if (object === undefined && interface === undefined) {
					return true;
				}
				for (var key in interface) {
					if (interface.hasOwnProperty(key)) {
						if (object === undefined) {
							return false;
						}
						if (object[key] === undefined || (msngr.utils.getType(interface[key]) !== msngr.utils.getType(object[key]))) {
							return false;
						}
						if (msngr.utils.isObject(interface[key])) {
							var result = this.ensureInterface(object[key], interface[key]);
							if (!result) {
								return result;
							}
						}
					}
				}
				return true;
			}
		}
	}
}()));
msngr.extend((function () {
	return {
		utils: {
			ThrowNotImplementedException: function () {
				throw "Method is not implemented";
			},
			ThrowRequiredParameterMissingOrUndefined: function (parameter) {
				throw parameter + " is a required parameter and must not be missing or undefined";
			}
		}
	};
}()));
msngr.extend((function () {
	return {
		utils: {
			getType: function (obj) {
				return Object.prototype.toString.call(obj);
			},
			isString: function (str) {
	            return (Object.prototype.toString.call(str) === "[object String]");
	        },
	        isDate: function (obj) {
	            return (Object.prototype.toString.call(obj) === "[object Date]");
	        },
	        isNumber: function (obj) {
	            return (Object.prototype.toString.call(obj) === "[object Number]");
	        },
	        isObject: function (obj) {
	            return (Object.prototype.toString.call(obj) === "[object Object]");
	        },
	        isFunction: function (func) {
	            return (Object.prototype.toString.call(func) === "[object Function]");
	        },
	        isEmptyString: function (str) {
	            var isStr = this.isString(str);
	            if (str === undefined || str === null || (isStr && str.toString().length === 0)) {
	                return true;
	            }
	            if (isStr) {
	                return false;
	            }
	            return undefined;
	        }
	    }
	};
}()));

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

msngr.extend((function () {

	return {
		send: function (message, callback) {
			
		}
	};
}()));

msngr.extend((function () {

	return {
		receive: function (message, callback) {
			
		}
	};
}()));

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
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
	module.exports = msngr;
}
