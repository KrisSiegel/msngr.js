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
		},
		removeFromArray: function (arr, value) {
			var inx = arr.indexOf(value);
			var endIndex = arr.length - 1;
			if (inx !== endIndex) {
				var temp = arr[endIndex];
				arr[endIndex] = arr[inx];
				arr[inx] = temp;
			}
			arr.pop();
		}
	};
}));
