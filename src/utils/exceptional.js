msngr.extend((function () {
	return {
		utils: {
			ThrowNotImplementedException: function () {
				throw "Method is not implemented";
			},
			ThrowRequiredParameterMissing: function (parameter) {
				throw parameter + " is a required parameter";
			}
		}
	};
}()));