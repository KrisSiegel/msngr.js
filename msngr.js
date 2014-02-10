var msngr = msngr || (function () {
	return {
		extend: function (obj, target) {
			target = (target || msngr);
			if (Object.prototype.toString.call(obj) === "[object Object]") {
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						if (Object.prototype.toString.call(obj[key]) === "[object Object]") {
							if (target[key] === undefined) {
								target[key] = { };
							}
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
			argumentsToArray: function (args) {
				return Array.prototype.slice.call(args, 0);
			}
		}
	}
}()));

msngr.extend((function () {
	return {
		utils: {
			ensureMessage: function (message) {
				if (!msngr.utils.isNullOrUndefined(message)) {
					if (msngr.utils.isString(message) && !msngr.utils.isEmptyString(message)) {
						return {
							topic: message
						};
					}
					return message;
				}
				return undefined;
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
			ThrowRequiredParameterMissingOrUndefinedException: function (params) {
				if (msngr.utils.isArray(params)) {
					throw params.join(",") + " are required parameters and must not be missing or undefined";
				} else {
					throw params + " is a required parameter and must not be missing or undefined";
				}
			},
			ThrowMismatchedInterfaceException: function (interface) {
				throw "The implementation does not match the " + (interface || "unknown") + " interface";
			}
		}
	};
}()));
msngr.extend((function () {
	return {
		utils: {
			arrayContains: function (arr, values) {
				if (msngr.utils.isNullOrUndefined(arr)) {
					return false;
				}

				if (!msngr.utils.isArray(values)) {
					values = [values];
				}

				for (var i = 0; i < values.length; ++i) {
					if (arr.indexOf(values[i]) === -1) {
						return false;
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
			getType: function (obj) {
				return Object.prototype.toString.call(obj);
			},
			isNullOrUndefined: function (obj) {
				return (obj === undefined || obj === null);
			},
			isString: function (str) {
	            return (this.getType(str) === "[object String]");
	        },
	        isDate: function (obj) {
	            return (this.getType(obj) === "[object Date]");
	        },
	        isArray: function (obj) {
	            return (this.getType(obj) === "[object Array]");
	        },
	        isNumber: function (obj) {
	            return (this.getType(obj) === "[object Number]");
	        },
	        isObject: function (obj) {
	            return (this.getType(obj) === "[object Object]");
	        },
	        isFunction: function (func) {
	            return (this.getType(func) === "[object Function]");
	        },
	        isEmptyString: function (str) {
	            var isStr = this.isString(str);
	            if (str === undefined || str === null || (isStr && str.toString().length === 0)) {
	                return true;
	            }
	            return false;
	        },
	        isWildCardStringMatch: function (str1, str2) {
	        	// SHort circuits
	        	if (!this.isNullOrUndefined(str1) && !this.isString(str1)) {
	        		return false;
	        	}
	        	if (!this.isNullOrUndefined(str2) && !this.isString(str2)) {
	        		return false;
	        	}
	            var str1Star = -1, str2Star = -1, shorterIndex = -1, str1EmptyResult, str2EmptyResult;

	            str1EmptyResult = this.isEmptyString(str1);
	            str2EmptyResult = this.isEmptyString(str2);

	            if (str1EmptyResult === true || str2EmptyResult === true) {
	                return true;
	            }

	            if (str1.toLowerCase() === str2.toLowerCase()) {
	                return true;
	            }
	            str1Star = str1.indexOf("*");
	            str2Star = str2.indexOf("*");
	            shorterIndex = shorterIndex = (str1Star === -1 || str2Star === -1) ? shorterIndex = Math.max(str1Star, str2Star) : shorterIndex = Math.min(str1Star, str2Star);
	            if ((str1Star !== -1 || str2Star !== -1) && shorterIndex !== -1) {
	                if (str1.substring(0, shorterIndex).toLowerCase() === str2.substring(0, shorterIndex).toLowerCase()) {
	                    return true;
	                }
	            }

	            return false;
	        },
	        isValidMessage: function (message) {
	        	// Short circuit if null or undefined
	        	if (this.isNullOrUndefined(message)) {
	        		return false;
	        	}
	        	
	        	// Short circuit if topic shortcut is used
	        	if (this.isString(message) && !this.isEmptyString(message)) {
	        		return true;
	        	}

	        	if (this.isNullOrUndefined(message.topic) || !this.isString(message.topic) || this.isEmptyString(message.topic)) {
	        		return false;
	        	}

	        	if (!this.isNullOrUndefined(message.category) && !this.isString(message.category)) {
	        		return false;
	        	}

	        	if (!this.isNullOrUndefined(message.dataType) && !this.isString(message.dataType)) {
	        		return false;
	        	}

	        	if (!this.isNullOrUndefined(message.target) && !this.isString(message.target)) {
	        		return false;
	        	}

	        	return true;

	        },
	        isMessageMatch: function (sent, target) {
	        	if (this.isWildCardStringMatch(sent.topic, target.topic)) {
	        		if (this.isWildCardStringMatch(sent.category, target.category)) {
	        			if (this.isWildCardStringMatch(sent.dataType, target.dataType)) {
	        				return true;
	        			}
	        		}
	        	}
	        	return false;
	        },
	        doesMessageContainWildcard: function (message) {
	        	message = this.ensureMessage(message);
	        	if (this.isValidMessage(message)) {
	        		if ((message.topic || "").indexOf("*") !== -1 || (message.category || "").indexOf("*") !== -1 || (message.dataType || ""	).indexOf("*") !== -1) {
	        			return true;
	        		}
	        	}
	        	return false;
	        }
	    }
	};
}()));

msngr.extend((function () {
	return {
		utils: {
			verifyInterface: function (object, interface) {
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
							var result = this.verifyInterface(object[key], interface[key]);
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
	var routers = [];
	return {
		registry: {
			add: function (router) {
				if (router === undefined) {
					msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("router");
				}
				if (msngr.utils.verifyInterface(router, msngr.interfaces.router)) {
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
	            return this;
			}
		}
	};
}()));

msngr.extend((function () {
	return {
		interfaces: {
			router: {
				send: function (message, callback, context) {
					msngr.utils.ThrowNotImplementedException();
				},
				receive: function (message, callback, context) {
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

msngr.extend((function () {

	return {
		send: function (message, callback, context) {
			if (!msngr.utils.isValidMessage(message)) {
				msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
			}
			
			for (var i = 0; i < msngr.registry.count(); ++i) {
				msngr.registry.get(i).send(msngr.utils.ensureMessage(message), callback, context);
			}
		}
	};
}()));

msngr.extend((function () {

	return {
		receive: function (message, callback, context) {
			if (!msngr.utils.isValidMessage(message)) {
				msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("message");
			}

			for (var i = 0; i < msngr.registry.count(); ++i) {
				msngr.registry.get(i).receive(msngr.utils.ensureMessage(message), callback, context);
			}
		}
	};
}()));

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
	module.exports = msngr;
}
