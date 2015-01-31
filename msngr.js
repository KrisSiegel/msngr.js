
var msngr = msngr || (function () {
	"use strict";
	
	return {
		version: "0.5.0",
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
						} else if (Object.prototype.toString.call(obj[key]) === "[object Array]") {
							target[key] = (target[key] || []).concat(obj[key]);
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
	"use strict";

	return {
		utils: {
			argumentsToArray: function (args) {
				return Array.prototype.slice.call(args, 0);
			}
		}
	};
}()));

msngr.extend((function () {
    "use strict";
    
    return {
        utils: {
            isHtmlElement: function (obj) {
                var t = this.getType(obj);
                return (t.indexOf("[object HTML") === 0) || (t.indexOf("[object global]") === 0);
            },
            isNodeList: function (obj) {
                return (this.getType(obj) === "[object NodeList]");
            },
            findElement: function (element) {
                var elm;
                if (msngr.utils.isHtmlElement(element)) {
                    elm = element;
                }

                if (elm === undefined && msngr.utils.isString(element)) {
                    var result = document.getElementById(element);
                    result = (result !== null) ? result : document.querySelector(element);
                    if (result !== null) {
                        elm = result;
                    }
                }

                return elm;
            },
            getDomPath: function (element) {
                var node = msngr.utils.isHtmlElement(element) ? element : undefined;
                if (node === undefined) {
                    return undefined;
                }

                if (node.id === undefined) {
                    node.id = msngr.utils.id();
                }

                return "#" + node.id;
            },
            querySelectorAllWithEq: function (selector) {
                if (selector === undefined) {
                    return null;
                }
                var queue = [];
                var process = function (input) {
                    if (input.indexOf(":eq(") === -1) {
                        return undefined;
                    }

                    var eqlLoc = input.indexOf(":eq(");
                    var sel = input.substring(0, eqlLoc);
                    var ind = input.substring((eqlLoc + 4), input.indexOf(")", eqlLoc));
                    selector = input.substring(input.indexOf(")", eqlLoc) + 1, input.length);

                    if (sel.charAt(0) === ">") {
                        sel = sel.substring(1, sel.length);
                    }

                    if (selector.charAt(0) === ">") {
                        selector = selector.substring(1, selector.length);
                    }

                    queue.push({
                        selector: sel,
                        index: parseInt(ind, 10)
                    });
                }
                while (selector.indexOf(":eq") !== -1) {
                    process(selector);
                }

                var result;
                while (queue.length > 0) {
                    var item = queue.shift();
                    result = (result || document).querySelectorAll(item.selector)[item.index];
                }

                if (selector.trim().length > 0) {
                    return (result || document).querySelectorAll(selector);
                }
                return [result];
            },
            querySelectorWithEq: function (selector) {
                return msngr.utils.querySelectorAllWithEq(selector)[0];
            }
        }
    };
}()));

msngr.extend((function () {
	"use strict";

	var idsUsed = { };

	return {
		utils: {
			id: function () {
				var ms = Date.now();
				var rand = Math.floor(((Math.random() + 1) * 10000));
				var i = ms + "-" + rand;

				if (idsUsed[i] !== undefined) {
					return msngr.utils.id();
				}

				idsUsed[i] = 0;
				return i;
			}
		}
	};
}()));

msngr.extend((function () {
	"use strict";
	
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
	            if (str === undefined || str === null || (isStr && str.toString().trim().length === 0)) {
	                return true;
	            }
	            return false;
	        }
	    }
	};
}()));

msngr.extend((function () {
  "use strict";

  return {

  };
}()));

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
	module.exports = msngr;
}
