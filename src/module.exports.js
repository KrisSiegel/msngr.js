/*
	module.exports.js

	If we're running in a node.js / io.js context then export msngr otherwise do nothing.
*/
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
	module.exports = msngr;
}
