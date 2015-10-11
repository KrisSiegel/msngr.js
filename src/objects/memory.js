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
                    var uuid = external.id();
                    id_to_message[uuid] = message;

                    if (!external.exist(index[message.topic])) {
                        index[message.topic] = {
                            uuids: [],
                            category: { }
                        };
                    }

                    if (!external.exist(index[message.topic].category[message.category])) {
                        index[message.topic].category[message.category] = {
                            uuids: [],
                            subcategory: { }
                        }
                    }

                    if (!external.exist(index[message.topic].category[message.category].subcategory[message.subcategory])) {
                        index[message.topic].category[message.category].subcategory[message.subcategory] = {
                            uuids: []
                        }
                    }


                    if (!external.exist(message.category) && !external.exist(message.subcategory)) {
                        index[message.topic].uuids.push(uuid);
                    }

                    if (external.exist(message.category) && !external.exist(message.subcategory)) {
                        index[message.topic].category[message.category].uuids.push(uuid);
                    }

                    if (external.exist(message.category) && external.exist(message.subcategory)) {
                        index[message.topic].category[message.category].subcategory[message.subcategory].uuids.push(uuid);
                    }

                    index_count++;

                    return uuid;
                }
                return undefined;
            },
            delete: function(uuid) {
                if (external.exist(uuid) && external.exist(id_to_message[uuid])) {
                    var message = id_to_message[uuid];

                    external.removeFromArray(index[message.topic].uuids, uuid);
                    external.removeFromArray(index[message.topic].category[message.category].uuids, uuid);
                    external.removeFromArray(index[message.topic].category[message.category].subcategory[message.subcategory].uuids, uuid);

                    delete id_to_message[uuid];
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

                    result = result.concat(indexTopic.uuids || []);
                    result = result.concat((indexTopicCategory || { }).uuids || []);
                    result = result.concat((indexTopicCategorySubcategory || { }).uuids || []);
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
