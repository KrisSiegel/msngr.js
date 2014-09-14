msngr.extend((function () {
    // deprecatedMessages holds the deprecated indexer data.
    // DO NOT REMOVE until deprecatedIndexer is removed.
    var deprecatedMessages = [];

    // NEW STUFF BELOW THIS COMMENT
    var index = {
        fk_message: { },
        exact: {
            topic: { },
            category: { },
            dataType: { }
        }
    };

    var indexField = function (field, message, fk) {
        if (msngr.utils.isNullOrUndefined(field) || msngr.utils.isEmptyString(field)) {
            return false;
        }

        if (msngr.utils.doesFieldContainWildcard(field, message)) {
            return false;
        }

        if (index.exact[field][message[field]] === undefined) {
            index.exact[field][message[field]] = { };
        }
        index.exact[field][message[field]][fk] = 0;

        return true;
    };

    var queryField = function (field, message) {
        if (message[field] === undefined || message[field] === undefined) {
            return undefined;
        }

        var result = { };

        if (!msngr.utils.doesFieldContainWildcard(field, message)) {
            // Field does not contain wildcard; perform exact query
            result = index.exact[field][message[field]];
            return result;
        } else {
            // Field contains wildcard; perform partial query
            var start = (msngr.utils.isNullOrUndefined(message[field]) ? undefined : message[field].substring(0, message[field].indexOf("*")));
            if (msngr.utils.isEmptyString(start)) {
                start = undefined;
            }
            for (var key in index.exact[field]) {
                if (index.exact[field].hasOwnProperty(key)) {
                    if (start === undefined && index.exact[field][key] !== undefined) {
                        for (var fk in index.exact[field][key]) {
                            if (index.exact[field][key].hasOwnProperty(fk)) {
                                result[fk] = 0;
                            }
                        }
                    } else {
                        if (index.exact[field][key] !== undefined && key.indexOf(start) === 0) {
                            for (var fk in index.exact[field][key]) {
                                if (index.exact[field][key].hasOwnProperty(fk)) {
                                    result[fk] = 0;
                                }
                            }
                        }
                    }
                }
            }
            return result;
        }
    };

    var deIndexField = function (field, message, fk) {
        var count = 0;
        for (var key in index.exact[field][message[field]]) {
            if (index.exact[field][message[field]].hasOwnProperty(key)) {
                count++;
            }
        }

        if (count === 1) {
            delete index.exact[field][message[field]];
            return true;
        } else {
            delete index.exact[field][message[field]][fk];
            return true;
        }
    };

    return {
        utils: {
            indexer: {
                index: function (message, fk) {
                    if (index.fk_message[fk] !== undefined) {
                        msngr.utils.ThrowForeignKeyNotUniqueException();
                    }

                    message = msngr.utils.ensureMessage(message);

                    index.fk_message[fk] = message;

                    indexField("topic", message, fk);

                    if (!msngr.utils.isNullOrUndefined(message.category)) {
                        indexField("category", message, fk);
                    }

                    if (!msngr.utils.isNullOrUndefined(message.dataType)) {
                        indexField("dataType", message, fk);
                    }

                },
                query: function (message) {
                    message = msngr.utils.ensureMessage(message);

                    var topics = queryField("topic", message);

                    var categories = queryField("category", message);
                    var dataTypes = queryField("dataType", message);

                    var result = {
                        count: 0,
                        items: { }
                    };

                    for (var fk in topics) {
                        if (topics.hasOwnProperty(fk)) {
                            if (message.category === undefined && message.dataType === undefined) {
                                result.items[fk] = 0;
                                result.count = (result.count + 1);
                            } else {
                                var cats = { };
                                if (categories !== undefined && categories[fk] !== undefined) {
                                    cats[fk] = 0;
                                }

                                var datas = { };
                                if (dataTypes !== undefined && dataTypes[fk] !== undefined) {
                                    datas[fk] = 0;
                                }

                                if (categories !== undefined && dataTypes !== undefined && categories[fk] === dataTypes[fk]) {
                                    result.items[fk] = 0;
                                    result.count = result.count + 1;
                                }

                                if ((message.category === undefined && categories === undefined) && dataTypes !== undefined && dataTypes[fk] !== undefined) {
                                    result.items[fk] = 0;
                                    result.count = result.count + 1;
                                }

                                if (categories !== undefined && (message.dataType === undefined && dataTypes === undefined) && categories[fk] !== undefined) {
                                    result.items[fk] = 0;
                                    result.count = result.count + 1;
                                }
                            }
                        }
                    }

                    return result;
                },
                remove: function (fk) {
                    if (index.fk_message[fk] !== undefined) {
                        var message = index.fk_message[fk];

                        deIndexField("topic", message, fk);

                        if (!msngr.utils.isNullOrUndefined(message.category)) {
                            deIndexField("category", message, fk);
                        }

                        if (!msngr.utils.isNullOrUndefined(message.dataType)) {
                            deIndexField("dataType", message, fk);
                        }

                        delete index.fk_message[fk];
                    }
                }
            },
            deprecatedIndexer: {
                index: function (message, fk) {
                    deprecatedMessages.push({
                        message: message,
                        key: fk
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
                remove: function (fk) {
                    for (var i = 0; i < deprecatedMessages.length; ++i) {
                        if (deprecatedMessages[i].key === fk) {
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
