/*
	module.exports.js

	If we're running in a node.js.
*/
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = msngr;
}
