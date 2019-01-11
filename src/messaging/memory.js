/*
    ./src/messaging/memory.js

    An indexer for message objects.
*/

msngr.extend(function (external, internal) {
    "use strict";

    // Wait, why are you re-implementing the functionality of msngr.is().there?
    // Alright, here's the deal. The memory indexer needs to be fast. Like very fast.
    // So this simplifies and implements only what we need. This is slightly faster.
    var exists = function (input) {
        return (input !== undefined && input !== null);
    };

    // A more efficient element removal from an array in cases where the array is large
    var removeFromArray = function(arr, value) {
        var inx = arr.indexOf(value);
        var endIndex = arr.length - 1;
        if (inx !== endIndex) {
            var temp = arr[endIndex];
            arr[endIndex] = arr[inx];
            arr[inx] = temp;
        }
        arr.pop();
    };

    internal.memory = function () {
        // Index for id to message objects
        var id_to_message = {};

        // Direct index (no partials) for message
        var index = { };

        // Message index count
        var index_count = 0;

        // Memory indexer API
        var mem = {
            index: function(message) {
                if (exists(message) && exists(message.topic)) {
                    var id = external.id();
                    id_to_message[id] = external.copy(message);

                    if (!exists(index[message.topic])) {
                        index[message.topic] = {
                            ids: [],
                            category: { }
                        };
                    }

                    if (!exists(index[message.topic].category[message.category])) {
                        index[message.topic].category[message.category] = {
                            ids: [],
                            subcategory: { }
                        }
                    }

                    if (!exists(index[message.topic].category[message.category].subcategory[message.subcategory])) {
                        index[message.topic].category[message.category].subcategory[message.subcategory] = {
                            ids: []
                        }
                    }


                    if (!exists(message.category) && !exists(message.subcategory)) {
                        index[message.topic].ids.push(id);
                    }

                    if (exists(message.category) && !exists(message.subcategory)) {
                        index[message.topic].category[message.category].ids.push(id);
                    }

                    if (exists(message.category) && exists(message.subcategory)) {
                        index[message.topic].category[message.category].subcategory[message.subcategory].ids.push(id);
                    }

                    index_count++;

                    return id;
                }
                return undefined;
            },
            getById: function (id) {
                return id_to_message[id];
            },
            delete: function(id) {
                if (exists(id) && exists(id_to_message[id])) {
                    var message = id_to_message[id];

                    removeFromArray(index[message.topic].ids, id);
                    removeFromArray(index[message.topic].category[message.category].ids, id);
                    removeFromArray(index[message.topic].category[message.category].subcategory[message.subcategory].ids, id);

                    delete id_to_message[id];
                    index_count--;

                    return true;
                }
                return false;
            },
            query: function(message) {
                var result = [];
                if (exists(message) && exists(message.topic) && exists(index[message.topic])) {
                    var indexTopic = index[message.topic];
                    var indexTopicCategory = ((indexTopic || { }).category || { })[message.category];
                    var indexTopicCategorySubcategory = ((indexTopicCategory || { }).subcategory || { })[message.subcategory];

                    result = result.concat(indexTopic.ids || []);
                    result = result.concat((indexTopicCategory || { }).ids || []);
                    result = result.concat((indexTopicCategorySubcategory || { }).ids || []);
                }

                // Now let's de-dupe the array
                var hash = { };
                var deduped = [];
                var resultLength = result.length;
                for (var i = 0; i < resultLength; ++i) {
                    if (hash[result[i]] === undefined) {
                        hash[result[i]] = true;
                        deduped.push(result[i]);
                    }
                }
                return deduped;
            },
            clear: function() {
                // Index for id to message objects
                id_to_message = {};

                // Direct index (no partials) for message
                index = { };

                index_count = 0;

                return true;
            }
        };

        Object.defineProperty(mem, "count", {
            get: function() {
                return index_count;
            }
        });

        return mem;
    };
});
