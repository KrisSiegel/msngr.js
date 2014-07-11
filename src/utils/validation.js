msngr.extend((function () {
	return {
		utils: {
			getType: function (obj) {
				return Object.prototype.toString.call(obj);
			},
			isNullOrUndefined: function (obj) {
				return (obj === undefined || obj === null);
			},
			isHtmlElement: function (obj) {
				var t = this.getType(obj);
				return (t.indexOf("[object HTML") === 0) || (t.indexOf("[object global]") === 0);
			},
			isNodeList: function (obj) {
				return (this.getType(obj) === "[object NodeList]");
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
	        },
			getPropertiesWithWildcards: function (message) {
				var results = [];

				if ((message.topic || "").indexOf("*") !== -1) {
					results.push("topic");
				}

				if ((message.category || "").indexOf("*") !== -1) {
					results.push("category");
				}

				if ((message.dataType || "").indexOf("*") !== -1) {
					results.push("dataType");
				}

				return results;
			}
	    }
	};
}()));
