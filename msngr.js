
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

	var nowPerformance = function () {
		return performance.now();
	};

	var nowNode = function () {
		return (process.hrtime()[1] / 1000000);
	};

	var nowLegacy = function () {
		return (new Date).getTime();
	};

	var nowExec = undefined;
	var nowExecDebugLabel = "";
	var lastNow = undefined;

	return {
		utils: {
			id: function () {
				var d = msngr.utils.now();
				var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					var r = (d + Math.random()*16)%16 | 0;
					d = Math.floor(d/16);
					return (c=='x' ? r : (r&0x3|0x8)).toString(16);
				});
				return uuid;
			},
			now: function (noDuplicate) {
				if (nowExec === undefined) {
					if (typeof performance !== "undefined") {
						nowExec = nowPerformance;
						nowExecDebugLabel = "performance";
					} else if (typeof process !== "undefined") {
						nowExec = nowNode;
						nowExecDebugLabel = "node";
					} else {
						nowExec = nowLegacy;
						nowExecDebugLabel = "legacy";
					}
				}
				var now = nowExec();
				if (noDuplicate && lastNow === now) {
					return msngr.utils.now(noDuplicate);
				}
				lastNow = now;
				return now;
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
			exists: function (obj) {
				return !this.isNullOrUndefined(obj);
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
	        },
			hasWildCard: function (str) {
				return (str.indexOf("*") !== -1);
			}
	    }
	};
}()));

msngr.extend((function () {
  "use strict";

  // Index for id to message objects
  var id_to_message = { };

  // Direct index (no partials) for message
  var message_topic_to_ids = { };
  var message_category_to_ids = { };
  var message_dataType_to_ids = { };

  // Message index count
  var index_count = 0;

  var directIndexIndex = function (index, fieldValue, uuid) {
      if (!msngr.utils.exists(index[fieldValue])) {
          index[fieldValue] = [];
      }
      if (index[fieldValue].indexOf(uuid) === -1) {
          index[fieldValue].push(uuid);
          return true;
      }

      return false;
  };

  var directIndexDelete = function (index, fieldValue, uuid) {
      if (msngr.utils.exists(index[fieldValue]) && index[fieldValue].indexOf(uuid) !== -1) {
          var inx = index[fieldValue].indexOf(uuid);
          var endIndex = index[fieldValue].length - 1;
          if (inx !== endIndex) {
              var temp = index[fieldValue][endIndex];
              index[fieldValue][endIndex] = index[fieldValue][inx];
              index[fieldValue][inx] = temp;
          }
          index[fieldValue].pop();
      }
  }

  return {
      stores: {
          memory: {
              index: function (message) {
                  if (msngr.utils.exists(message)) {
                      var uuid = msngr.utils.id();
                      id_to_message[uuid] = message;

                      if (msngr.utils.exists(message.topic)) {
                          directIndexIndex(message_topic_to_ids, message.topic, uuid);
                      }

                      if (msngr.utils.exists(message.category)) {
                          directIndexIndex(message_category_to_ids, message.category, uuid);
                      }

                      if (msngr.utils.exists(message.dataType)) {
                          directIndexIndex(message_dataType_to_ids, message.dataType, uuid);
                      }

                      index_count++;

                      return uuid;
                  }
                  return undefined;
              },
              delete: function (uuid) {
                  if (msngr.utils.exists(uuid) && msngr.utils.exists(id_to_message[uuid])) {
                      var message = id_to_message[uuid];

                      if (msngr.utils.exists(message.topic)) {
                          directIndexDelete(message_topic_to_ids, message.topic, uuid);
                      }

                      if (msngr.utils.exists(message.category)) {
                          directIndexDelete(message_category_to_ids, message.category, uuid);
                      }

                      if (msngr.utils.exists(message.dataType)) {
                          directIndexDelete(message_dataType_to_ids, message.dataType, uuid);
                      }

                      delete id_to_message[uuid];
                      index_count--;

                      return true;
                  }
              },
              query: function (message) {
                  if (msngr.utils.exists(message)) {

                      if (msngr.utils.exists(message.topic)) {

                      }

                      if (msngr.utils.exists(message.category)) {

                      }

                      if (msngr.utils.exists(message.dataType)) {

                      }
                  }
              },
              clear: function () {
                  // Index for id to message objects
                  id_to_message = { };

                  // Direct index (no partials) for message
                  message_topic_to_ids = { };
                  message_category_to_ids = { };
                  message_dataType_to_ids = { };

                  index_count = 0;

                  return true;
              },
              count: function () {
                  return index_count;
              }
          }
      }
  };
}()));

msngr.extend((function () {
    "use strict";

    return {
        bind: function () {

        },
        unbind: function () {
            
        }
    };
}()));

msngr.extend((function () {
    "use strict";

    return {
        emit: function () {

        },
        register: function () {

        },
        unregister: function () {
            
        }
    };
}()));

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
	module.exports = msngr;
}
