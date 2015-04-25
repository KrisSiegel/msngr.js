/*
    ./src/builders/message.js
*/
msngr.extend((function (external, internal) {
	"use strict";

	return {
		builders: {
			msg: function () {
				return (function () {
					var message = { };
					var props = ["topic", "category", "dataType", "payload"].concat(msngr.getAvailableActions());

					var obj = {
						build: function () {
							return message;
						}
					};

					for (var i = 0; i < props.length; ++i) {
						(function (key) {
							obj[key] = function (input) {
								message[key] = input;
								return obj;
							};
						}(props[i]));
					}

					return obj;
				}());
			}
		}
	};
}));
