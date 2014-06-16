msngr.extend((function () {
    var messages = [];
    return {
        utils: {
            indexer: {
                index: function (message, callback) {
                    messages.push({
                        message: message,
                        callback: callback
                    });
                },
                query: function (message) {
                    var result = [];
                    for (var i = 0; i < messages.length; ++i) {
                        if (msngr.utils.isMessageMatch(message, messages[i].message)) {
                            result.push(messages[i].callback);
                        }
                    }
                    return result;
                },
                remove: function (receiver) {
                    for (var i = 0; i < messages.length; ++i) {
                        if (messages[i].callback === receiver) {
                            // Swapping values is faster than splice in most cases and makes removal easier.
                            var last = messages[messages.length - 1];
                            messages[messages.length - 1] = messages[i];
                            messages[i] = last;
                            messages.pop();
                        }
                    }
                }
            }
        }
    }
}()));
