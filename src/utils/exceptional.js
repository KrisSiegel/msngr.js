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