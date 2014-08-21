msngr.extend((function () {
    // This holds the deprecated indexer data.
    // DO NOT REMOVE until deprecatedIndexer is removed.
    var deprecatedMessages = [];

    
    return {
        utils: {
            indexer: {
                index: function (message, fk) {

                },
                query: function (message) {

                },
                remove: function (fk) {

                }
            },
            deprecatedIndexer: {
                index: function (message, key) {
                    deprecatedMessages.push({
                        message: message,
                        key: key
                    });
                },
                query: function (message) {
                    var result = [];
                    for (var i = 0; i < deprecatedMessages.length; ++i) {
                        if (msngr.utils.isMessageMatch(message, deprecatedMessages[i].message)) {
                            result.push(deprecatedMessages[i].key);
                        }
                    }
                    return result;
                },
                remove: function (receiver) {
                    for (var i = 0; i < deprecatedMessages.length; ++i) {
                        if (deprecatedMessages[i].key === receiver) {
                            // Swapping values is faster than splice in most cases and makes removal easier.
                            var last = deprecatedMessages[deprecatedMessages.length - 1];
                            deprecatedMessages[deprecatedMessages.length - 1] = deprecatedMessages[i];
                            deprecatedMessages[i] = last;
                            deprecatedMessages.pop();
                        }
                    }
                }
            }
        }
    }
}()));
