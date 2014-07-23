msngr.extend((function () {
    return {
        unregister: function (id) {
            if (msngr.utils.isNullOrUndefined(id)) {
                msngr.utils.ThrowRequiredParameterMissingOrUndefinedException("id");
            }

            var result = [];
            for (var i = 0; i < msngr.registry.routers.count(); ++i) {
                result.push(msngr.registry.routers.get(i).unregister(id));
            }

            if (result.length === 1) {
                return result[0];
            }
            return result;
        }
    };
}()));
