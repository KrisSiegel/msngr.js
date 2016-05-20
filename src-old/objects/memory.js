msngr.extend((function(external, internal) {
    "use strict";

    internal.objects = internal.objects || {};
    internal.objects.memory = function() {

        // Index for id to message objects
        var id_to_message = {};

        // Direct index (no partials) for message
        var index = { };

        // Message index count
        var index_count = 0;

        var mem = {
            index: function(message) {
                if (external.exist(message) && external.exist(message.topic)) {
                    var id = external.id();
                    id_to_message[id] = external.copy(message);

                    if (!external.exist(index[message.topic])) {
                        index[message.topic] = {
                            ids: [],
                            category: { }
                        };
                    }

                    if (!external.exist(index[message.topic].category[message.category])) {
                        index[message.topic].category[message.category] = {
                            ids: [],
                            subcategory: { }
                        }
                    }

                    if (!external.exist(index[message.topic].category[message.category].subcategory[message.subcategory])) {
                        index[message.topic].category[message.category].subcategory[message.subcategory] = {
                            ids: []
                        }
                    }


                    if (!external.exist(message.category) && !external.exist(message.subcategory)) {
                        index[message.topic].ids.push(id);
                    }

                    if (external.exist(message.category) && !external.exist(message.subcategory)) {
                        index[message.topic].category[message.category].ids.push(id);
                    }

                    if (external.exist(message.category) && external.exist(message.subcategory)) {
                        index[message.topic].category[message.category].subcategory[message.subcategory].ids.push(id);
                    }

                    index_count++;

                    return id;
                }
                return undefined;
            },
            delete: function(id) {
                if (external.exist(id) && external.exist(id_to_message[id])) {
                    var message = id_to_message[id];

                    external.removeFromArray(index[message.topic].ids, id);
                    external.removeFromArray(index[message.topic].category[message.category].ids, id);
                    external.removeFromArray(index[message.topic].category[message.category].subcategory[message.subcategory].ids, id);

                    delete id_to_message[id];
                    index_count--;

                    return true;
                }
                return false;
            },
            query: function(message) {
                var result = [];
                if (external.exist(message) && external.exist(message.topic) && external.exist(index[message.topic])) {
                    var indexTopic = index[message.topic];
                    var indexTopicCategory = ((indexTopic || { }).category || { })[message.category];
                    var indexTopicCategorySubcategory = ((indexTopicCategory || { }).subcategory || { })[message.subcategory];

                    result = result.concat(indexTopic.ids || []);
                    result = result.concat((indexTopicCategory || { }).ids || []);
                    result = result.concat((indexTopicCategorySubcategory || { }).ids || []);
                }

                return external.deDupeArray(result);
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

    // This is an internal extension; do not export explicitly.
    return {};
}));
