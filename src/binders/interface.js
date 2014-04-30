msngr.extend((function () {
    return {
        interfaces: {
            binder: {
                bind: function (element, event, message) {
                    msngr.utils.ThrowNotImplementedException();
                }
            }
        }
    };
}()));
