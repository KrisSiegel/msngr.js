msngr.extend((function () {
    var messages = [];
    return {
        utils: {
            indexer: {
                index: function (message, receiverId) {
                    messages.push({
                        message: message,
                        receiverId: receiverId
                    });
                },
                query: function (message) {
                    var result = [];
                    for (var i = 0; i < messages.length; ++i) {
                        if (msngr.utils.isMessageMatch(message, messages[i].message)) {
                            result.push(messages[i].receiverId);
                        }
                    }
                    return result;
                }
            }
        }
    }
}()));
