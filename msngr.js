/*
	main.js

	The main entry point for msngr.js. Covers internal and external interface generation,
	versioning (for programmatic access) and the core extend method.
*/
var msngr = msngr || (function () {
	"use strict";

	var internal = { };
	var external = function (topic, category, dataType) {
		return internal.objects.message(topic, category, dataType);
	};

	external.version = "2.0.0";

	external.extend = function (obj, target) {
		target = (target || external);
		if (Object.prototype.toString.call(obj) === "[object Function]") {
			obj = obj.apply(this, [external, internal]);
		}

		if (Object.prototype.toString.call(obj) === "[object Object]") {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (Object.prototype.toString.call(obj[key]) === "[object Object]") {
						if (target[key] === undefined) {
							target[key] = { };
						}
						target[key] = external.extend(obj[key], target[key]);
					} else if (Object.prototype.toString.call(obj[key]) === "[object Array]") {
						target[key] = (target[key] || []).concat(obj[key]);
					} else {
						target[key] = obj[key];
					}
				}
			}
		}
		return target;
	};

	// Create a debug property to allow explicit exposure to the internal object structure.
	// This should only be used during unit test runs and debugging.
	Object.defineProperty(external, "debug", {
		set: function (value) {
			if (value === true) {
				external.internal = internal;
			} else if (value === false) {
				delete external.internal;
			}
		}
	});

	return external;
}());

msngr.extend((function (external, internal) {
	"use strict";

	return {
		argumentsToArray: function (args) {
			if (external.isArray(args)) {
				return args;
			}
			if (external.isArguments(args)) {
				return Array.prototype.slice.call(args, 0);
			}
			return [args];
		}
	};
}));

msngr.extend((function (external, internal) {
    "use strict";

    return {
        isHtmlElement: function (obj) {
            var t = this.getType(obj);
            return (t.indexOf("[object HTML") === 0) || (t.indexOf("[object global]") === 0);
        },
        isNodeList: function (obj) {
            return (this.getType(obj) === "[object NodeList]");
        },
        findElement: function (element, root) {
            var elms = external.findElements(element);
            if (elms !== undefined && elms.length > 0) {
                return elms[0];
            }

            return elms;
        },
        findElements: function (selector, root) {
            var elm;
            if (external.isHtmlElement(selector)) {
                elm = selector;
            }

            if (elm === undefined && external.isString(selector)) {
                var doc = root || document;
                var result = doc.querySelectorAll(selector);
                if (result !== null) {
                    elm = result;
                }
            }

            return elm;
        },
        getDomPath: function (element) {
            var node = external.isHtmlElement(element) ? element : undefined;
            if (node === undefined) {
                return undefined;
            }

            if (node.id === undefined) {
                node.id = external.id();
            }

            return "#" + node.id;
        },
        querySelectorAllWithEq: function (selector, root) {
            if (selector === undefined) {
                return null;
            }
            var doc = root || document;
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
                result = (result || doc).querySelectorAll(item.selector)[item.index];
            }

            if (selector.trim().length > 0) {
                return (result || doc).querySelectorAll(selector);
            }
            return [result];
        },
        querySelectorWithEq: function (selector) {
            return external.querySelectorAllWithEq(selector)[0];
        }
    };
}));

msngr.extend((function (external, internal) {
	"use strict";

    internal.InvalidParametersException = function (str) {
        return {
            name: "InvalidParametersException",
            severity: "unrecoverable",
            message: ("Invalid parameters supplied to the {method} method".replace("{method}", str))
        };
    };

    internal.ReservedKeywordsException = function (keyword) {
        return {
            name: "ReservedKeywordsException",
            severity: "unrecoverable",
            message: ("Reserved keyword {keyword} supplied as action.".replace("{keyword}", keyword))
        };
    };

    // This is an internal extension; do not export explicitly.
	return { };
}));

msngr.extend((function (external, internal) {
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
		id: function () {
			var d = external.now();
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
			if (noDuplicate === true && lastNow === now) {
				return external.now(noDuplicate);
			}
			lastNow = now;
			return now;
		}
	};
}));

msngr.extend((function (external, internal) {
	"use strict";

	internal.reiterativeValidation = function (validationMethod, inputs) {
		var result = false;
		if (external.exist(validationMethod) && external.exist(inputs)) {
			if (!external.isArray(inputs)) {
				inputs = [inputs];
			}
			for (var i = 0; i < inputs.length; ++i) {
				result = validationMethod.apply(this, [inputs[i]]);
				if (result === false) {
					break;
				}
			}
		}
		return result;
	};

	return {
		getType: function (obj) {
			if (!external.exist(obj)) {
				return "" + obj;
			}
			return Object.prototype.toString.call(obj);
		},
		isArguments: function (obj) {
			return (external.getType(obj) === "[object Arguments]");
		},
		areArguments: function () {
			return internal.reiterativeValidation(external.isArguments, external.argumentsToArray(arguments));
		},
		isNullOrUndefined: function (obj) {
			return (obj === undefined || obj === null);
		},
		exist: function (obj) {
			return !external.isNullOrUndefined(obj);
		},
		exists: function () {
			return internal.reiterativeValidation(external.exist, external.argumentsToArray(arguments));
		},
		isString: function (str) {
            return (external.getType(str) === "[object String]");
        },
		areStrings: function () {
			return internal.reiterativeValidation(external.isString, external.argumentsToArray(arguments));
		},
        isDate: function (obj) {
            return (external.getType(obj) === "[object Date]");
        },
		areDates: function () {
			return internal.reiterativeValidation(external.isDate, external.argumentsToArray(arguments));
		},
        isArray: function (obj) {
            return (external.getType(obj) === "[object Array]");
        },
		areArrays: function () {
			return internal.reiterativeValidation(external.isArray, external.argumentsToArray(arguments));
		},
        isNumber: function (obj) {
            return (external.getType(obj) === "[object Number]");
        },
		areNumbers: function () {
			return internal.reiterativeValidation(external.isNumber, external.argumentsToArray(arguments));
		},
        isObject: function (obj) {
            return (external.getType(obj) === "[object Object]");
        },
		areObjects: function () {
			return internal.reiterativeValidation(external.isObject, external.argumentsToArray(arguments));
		},
        isFunction: function (func) {
            return (external.getType(func) === "[object Function]");
        },
		areFunctions: function () {
			return internal.reiterativeValidation(external.isFunction, external.argumentsToArray(arguments));
		},
        isEmptyString: function (str) {
            var isStr = external.isString(str);
            if (str === undefined || str === null || (isStr && str.toString().trim().length === 0)) {
                return true;
            }
            return false;
        },
		areEmptyStrings: function () {
			return internal.reiterativeValidation(external.isEmptyString, external.argumentsToArray(arguments));
		},
		hasWildCard: function (str) {
			return (str.indexOf("*") !== -1);
		}
	};
}));

msngr.extend((function (external, internal) {
    "use strict";

    internal.objects = internal.objects || { };
    internal.objects.executer = function (methods, payload, context) {

        if (external.isFunction(methods)) {
            methods = [methods];
        }

        if (!external.exist(methods) || !external.isArray(methods)) {
            throw internal.InvalidParametersException("executor");
        }

        var exec = function (method, pay, ctx, done) {
            setTimeout(function () {
                var async = false;
                var async = function () {
                    async = true;
                    return function (result) {
                        done.apply(ctx, [result]);
                    };
                }
                var syncResult = method.apply(ctx || this, [pay, async]);
                if (async !== true) {
                    done.apply(ctx, [syncResult]);
                }
            }, 0);
        };

        return {
            execute: function (done) {
                if (methods.length === 0 && external.exist(done)) {
                    return done.apply(context, [[]]);
                }
                return exec(methods[0], payload, context, done);
            },
            parallel: function (done) {
                var results = [];
                var executed = 0;

                if (methods.length === 0 && external.exist(done)) {
                    return done.apply(context, [[]]);
                }

                for (var i = 0; i < methods.length; ++i) {
                    (function (m, p, c) {
                        exec(m, p, c, function (result) {
                            if (external.exist(result)) {
                                results.push(result);
                            }

                            ++executed;

                            if (executed === methods.length && external.exist(done)) {
                                done.apply(context, [results]);
                            }
                        });
                    }(methods[i], payload, context));
                }
            }
        };
    };

    // This is an internal extension; do not export explicitly.
    return { };
}));

msngr.extend((function (external, internal) {
    "use strict";

    internal.objects = internal.objects || { };

    var handlers = { };
    var handlerCount = 0;

    Object.defineProperty(external, "handlerCount", {
        get: function () {
            return handlerCount;
        }
    });

    internal.reset = function () {
        handlers = { };
        handlerCount = 0;
        internal.store.clear();
    };

    internal.objects.message = function (topic, category, dataType) {
        var msg = undefined;
        if (!external.exist(topic)) {
            throw internal.InvalidParametersException("msngr");
        }

        if (!external.isObject(topic) && !external.isString(topic)) {
            throw internal.InvalidParametersException("msngr");
        }

        if (external.isEmptyString(topic)) {
            throw internal.InvalidParametersException("msngr");
        }

        if (external.isObject(topic)) {
            msg = topic;
        } else {
            msg = { };
            msg.topic = topic;

            if (!external.isEmptyString(category)) {
                msg.category = category;
            }

            if (!external.isEmptyString(dataType)) {
                msg.dataType = dataType;
            }
        }

        var msgObj =  {
            emit: function (payload, callback) {
                var uuids = internal.store.query(msg);
                if (uuids.length > 0) {
                    var methods = [];
                    for (var i = 0; i < uuids.length; ++i) {
                        var obj = handlers[uuids[i]];
                        methods.push(obj.handler);
                    }
                    var execs = internal.objects.executer(methods, payload, (msg.context || this));

                    execs.parallel(callback);
                }

                return msgObj;
            },
            persist: function (payload) {

            },
            on: function (handler) {
                var uuid = internal.store.index(msg);
                handlers[uuid] = {
                    handler: handler,
                    context: (msg.context || this)
                };
                handlerCount++;

                return msgObj;
            },
            bind: function (element, event) {

            },
            drop: function (handler) {
                var uuids = internal.store.query(msg);
                if (uuids.length > 0) {
                    for (var i = 0; i < uuids.length; ++i) {
                        var uuid = uuids[i];
                        if (handlers[uuid].handler === handler) {
                            delete handlers[uuid];
                            handlerCount--;

                            internal.store.delete(uuid);
                        }
                    }
                }

                return msgObj;
            },
            unbind: function (element, event) {

            },
            dropAll: function () {
                var uuids = internal.store.query(msg);
                if (uuids.length > 0) {
                    for (var i = 0; i < uuids.length; ++i) {
                        var uuid = uuids[i];
                        delete handlers[uuid];
                        handlerCount--;

                        internal.store.delete(uuid);
                    }
                }

                return msgObj;
            }
        };

        Object.defineProperty(msgObj, "message", {
    		get: function () {
    			return msg;
    		}
    	});

        return msgObj;
    };

    // This is an internal extension; do not export explicitly.
    return { };
}));

msngr.extend((function (external, internal) {
  "use strict";

  // Index for id to message objects
  var id_to_message = { };

  // Direct index (no partials) for message
  var direct_index = {
      topic_to_id: { },
      topic_cat_to_id: { },
      topic_type_to_id: { },
      topic_cat_type_to_id: { }
  };

  // Message index count
  var index_count = 0;

  var deleteValueFromArray = function (arr, value) {
      var inx = arr.indexOf(value);
      var endIndex = arr.length - 1;
      if (inx !== endIndex) {
          var temp = arr[endIndex];
          arr[endIndex] = arr[inx];
          arr[inx] = temp;
      }
      arr.pop();
  };

  internal.store = {
      index: function (message) {
          if (external.exist(message) && external.exist(message.topic)) {
              var uuid = external.id();
              id_to_message[uuid] = message;

              if (direct_index.topic_to_id[message.topic] === undefined) {
                  direct_index.topic_to_id[message.topic] = [];
              }
              direct_index.topic_to_id[message.topic].push(uuid);

              if (external.exist(message.category)) {
                  if (direct_index.topic_cat_to_id[message.topic] === undefined) {
                      direct_index.topic_cat_to_id[message.topic] = { };
                  }

                  if (direct_index.topic_cat_to_id[message.topic][message.category] === undefined) {
                      direct_index.topic_cat_to_id[message.topic][message.category] = [];
                  }

                  direct_index.topic_cat_to_id[message.topic][message.category].push(uuid);
              }

              if (external.exist(message.dataType)) {
                  if (direct_index.topic_type_to_id[message.topic] === undefined) {
                      direct_index.topic_type_to_id[message.topic] = { };
                  }

                  if (direct_index.topic_type_to_id[message.topic][message.dataType] === undefined) {
                      direct_index.topic_type_to_id[message.topic][message.dataType] = [];
                  }

                  direct_index.topic_type_to_id[message.topic][message.dataType].push(uuid);
              }

              if (external.exist(message.category) && external.exist(message.dataType)) {
                  if (direct_index.topic_cat_type_to_id[message.topic] === undefined) {
                      direct_index.topic_cat_type_to_id[message.topic] = { };
                  }

                  if (direct_index.topic_cat_type_to_id[message.topic][message.category] === undefined) {
                      direct_index.topic_cat_type_to_id[message.topic][message.category] = { };
                  }

                  if (direct_index.topic_cat_type_to_id[message.topic][message.category][message.dataType] === undefined) {
                      direct_index.topic_cat_type_to_id[message.topic][message.category][message.dataType] = [];
                  }

                  direct_index.topic_cat_type_to_id[message.topic][message.category][message.dataType].push(uuid);
              }

              index_count++;

              return uuid;
          }
          return undefined;
      },
      delete: function (uuid) {
          if (external.exist(uuid) && external.exist(id_to_message[uuid])) {
              var message = id_to_message[uuid];

              if (external.exist(message.topic)) {
                  deleteValueFromArray(direct_index.topic_to_id[message.topic], uuid);

                  if (external.exist(message.category)) {
                      deleteValueFromArray(direct_index.topic_cat_to_id[message.topic][message.category], uuid);
                  }

                  if (external.exist(message.dataType)) {
                      deleteValueFromArray(direct_index.topic_type_to_id[message.topic][message.dataType], uuid);
                  }

                  if (external.exist(message.category) && external.exist(message.dataType)) {
                      deleteValueFromArray(direct_index.topic_cat_type_to_id[message.topic][message.category][message.dataType], uuid);
                  }
              }

              delete id_to_message[uuid];
              index_count--;

              return true;
          }
          return false;
      },
      query: function (message) {
          if (external.exist(message)) {
              if (external.exist(message.topic)) {
                  // Topic Only Results
                  if (!external.exist(message.category) && !external.exist(message.dataType)) {
                      return direct_index.topic_to_id[message.topic] || [];
                  }

                  // Topic + Category Results
                  if (external.exist(message.category) && !external.exist(message.dataType)) {
                      return (direct_index.topic_cat_to_id[message.topic] || { })[message.category] || [];
                  }

                  // Topic + Data Type Results
                  if (external.exist(message.dataType) && !external.exist(message.category)) {
                      return (direct_index.topic_type_to_id[message.topic] || { })[message.dataType] || [];
                  }

                  // Topic + Category + Data Type Results
                  if (external.exist(message.category) && external.exist(message.dataType)) {
                      return ((direct_index.topic_cat_type_to_id[message.topic] || { })[message.category] || { })[message.dataType] || [];
                  }
              }
          }

          return [];
      },
      clear: function () {
          // Index for id to message objects
          id_to_message = { };

          // Direct index (no partials) for message
          direct_index = {
              topic_to_id: { },
              topic_cat_to_id: { },
              topic_type_to_id: { },
              topic_cat_type_to_id: { }
          };

          index_count = 0;

          return true;
      },
      count: function () {
          return index_count;
      }
  };

  // This is an internal extension; do not export explicitly.
  return { };
}));

msngr.extend((function (external, internal) {
    "use strict";

    // Throw statements
    var InvalidParametersException = function (str) {
        return {
            severity: "unrecoverable",
            message: ("Invalid parameters supplied to the {method} method".replace("{method}", str))
        };
    };

    var UnexpectedException = function (str) {
        return {
            severity: "unrecoverable",
            message: ("An unexpected exception occured in the {method} method".replace("{method}", str))
        };
    };

    var registerdPaths = { };
    var registerdEvents = 0;

    var listener = function (event) {
        var node = this;
        var path = external.getDomPath(node);

        if (external.exist(registerdPaths[path])) {
            if (external.exist(registerdPaths[path][event.type])) {
                return msngr.emit(registerdPaths[path][event.type], event);
            }
        }

        // How did we get here? Must be a memory leak or something. Ugh
        return msngr;
    };

    return {
        bind: function (element, event, topic, category, dataType) {
            if (!external.exist(element) || !external.exist(event) || !external.exist(topic)) {
                throw InvalidParametersException("bind");
            }
            if (external.isObject(topic) && !external.exist(topic.topic)) {
                throw InvalidParametersException("bind");
            }

            var node = external.findElement(element);
            var path = external.getDomPath(node);

            if (!external.exist(registerdPaths[path])) {
                registerdPaths[path] = { };
            }

            var message = undefined;
            if (external.isObject(topic)) {
                message = topic;
            } else {
                message = { };
                message.topic = topic;

                if (external.exist(category)) {
                    message.category = category;
                }

                if (external.exist(dataType)) {
                    message.dataType = dataType;
                }
            }

            registerdPaths[path][event] = message;

            node.addEventListener(event, listener);

            registerdEvents++;

            return msngr;
        },
        unbind: function (element, event) {
            var node = external.findElement(element);
            var path = external.getDomPath(node);

            if (external.exist(registerdPaths[path])) {
                if (external.exist(registerdPaths[path][event])) {
                    node.removeEventListener(event, listener);

                    delete registerdPaths[path][event];

                    registerdEvents--;
                }
            }

            return msngr;
        },
        getBindCount: function () {
            return registerdEvents;
        }
    };
}));

/*msngr.extend((function (external, internal) {
    "use strict";

    var reservedProperties = ["topic", "category", "dataType", "payload"];
    var actions = { };
    var actionsCount = 0;

    return {
        action: function (property, handler) {
            if (!external.exist(property) || !external.exist(handler)) {
                throw internal.InvalidParametersException("action");
            }

            if (reservedProperties.indexOf(property) !== -1) {
                throw internal.ReservedKeywordsException(property);
            }

            actions[property] = handler;
            actionsCount++;
        },
        inaction: function (property) {
            if (!external.exist(property)) {
                throw internal.InvalidParametersException("inaction");
            }

            delete actions[property];
            actionsCount--;
        },
        act: function (message, superWrap) {
            if (!external.exist(message) || !external.exist(superWrap)) {
                throw internal.InvalidParametersException("act");
            }

            (function (msg, sw) {
                if (actionsCount > 0) {
                    var wrap = {
                        preventDefault: function () {
                            sw.preventDefault();
                        },
                        payload: sw.payload
                    };
                    for (var key in msg) {
                        if (msg.hasOwnProperty(key)) {
                            if (reservedProperties.indexOf(key) === -1) {
                                if (actions[key] !== undefined) {
                                    actions[key].apply(this, [msg, wrap]);
                                }
                            }
                        }
                    }
                    sw.payload = wrap.payload;
                }
                return sw.done();
            }(message, superWrap));
        },
        getActionCount: function () {
            return actionsCount;
        },
        getAvailableActions: function () {
            return Object.keys(actions);
        }
    };
}));
*/

/*msngr.action("dom", function (message, wrap) {
    "use strict";

    if (msngr.exist(message.dom)) {
        var norm = {
            gather: undefined,
            doc: undefined
        };
        if (!msngr.isObject(message.dom)) {
            if (msngr.isArray(message.dom)) {
                norm.gather = message.dom;
            } else if (msngr.isString(message.dom)) {
                norm.gather = [message.dom];
            }
        } else {
            if (msngr.exist(message.dom.gather)) {
                norm.gather = (msngr.isArray(message.dom.gather) ? message.dom.gather : [message.dom.gather]);
            }
            if (msngr.exist(message.dom.root || message.dom.doc)) {
                norm.doc = message.dom.root || message.dom.doc;
            }
        }

        if (msngr.exist(norm.gather) && norm.gather.length > 0) {
            if (!msngr.isObject(wrap.payload)) {
                wrap.payload = { };
            }

            for (var i = 0; i < norm.gather.length; ++i) {
                var elms = msngr.findElements(norm.gather[i], message.dom.root);
                if (msngr.exist(elms) && elms.length > 0) {
                    for (var j = 0; j < elms.length; ++j) {
                        var elm = elms[j];

                        var prop;
                        if (msngr.exist(elm.getAttribute("name")) && !msngr.isEmptyString(elm.getAttribute("name"))) {
                            prop = elm.getAttribute("name");
                        } else if (msngr.exist(elm.id) && !msngr.isEmptyString(elm.id)) {
                            prop = elm.getAttribute("id");
                            console.log(elm.id);
                        } else {
                            prop = elm.tagName.toLowerCase() + j;
                        }

                        wrap.payload[prop] = elm.value;
                    }
                }
            }
        }
    }

    return msngr;
});
*/

/*
	module.exports.js

	If we're running in a node.js / io.js context then export msngr otherwise do nothing.
*/
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
	module.exports = msngr;
}
