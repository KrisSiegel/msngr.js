msngr.extend((function () {
  "use strict";

  // Index for id to message objects
  var id_to_message = { };

  // Direct index (no partials) for message
  var direct_index = {
      topic_to_id: { },
      topic_cat_to_id: { },
      topic_type_to_id: { },
      topic_cat_type_to_id: { }
  };

  // Message index count
  var index_count = 0;

  var deleteValueFromArray = function (arr, value) {
      var inx = arr.indexOf(value);
      var endIndex = arr.length - 1;
      if (inx !== endIndex) {
          var temp = arr[endIndex];
          arr[endIndex] = arr[inx];
          arr[inx] = temp;
      }
      arr.pop();
  };

  return {
      stores: {
          memory: {
              index: function (message) {
                  if (msngr.utils.exists(message) && msngr.utils.exists(message.topic)) {
                      var uuid = msngr.utils.id();
                      id_to_message[uuid] = message;

                      if (direct_index.topic_to_id[message.topic] === undefined) {
                          direct_index.topic_to_id[message.topic] = [];
                      }
                      direct_index.topic_to_id[message.topic].push(uuid);

                      if (msngr.utils.exists(message.category)) {
                          if (direct_index.topic_cat_to_id[message.topic] === undefined) {
                              direct_index.topic_cat_to_id[message.topic] = { };
                          }

                          if (direct_index.topic_cat_to_id[message.topic][message.category] === undefined) {
                              direct_index.topic_cat_to_id[message.topic][message.category] = [];
                          }

                          direct_index.topic_cat_to_id[message.topic][message.category].push(uuid);
                      }

                      if (msngr.utils.exists(message.dataType)) {
                          if (direct_index.topic_type_to_id[message.topic] === undefined) {
                              direct_index.topic_type_to_id[message.topic] = { };
                          }

                          if (direct_index.topic_type_to_id[message.topic][message.dataType] === undefined) {
                              direct_index.topic_type_to_id[message.topic][message.dataType] = [];
                          }

                          direct_index.topic_type_to_id[message.topic][message.dataType].push(uuid);
                      }

                      if (msngr.utils.exists(message.category) && msngr.utils.exists(message.dataType)) {
                          if (direct_index.topic_cat_type_to_id[message.topic] === undefined) {
                              direct_index.topic_cat_type_to_id[message.topic] = { };
                          }

                          if (direct_index.topic_cat_type_to_id[message.topic][message.category] === undefined) {
                              direct_index.topic_cat_type_to_id[message.topic][message.category] = { };
                          }

                          if (direct_index.topic_cat_type_to_id[message.topic][message.category][message.dataType] === undefined) {
                              direct_index.topic_cat_type_to_id[message.topic][message.category][message.dataType] = [];
                          }

                          direct_index.topic_cat_type_to_id[message.topic][message.category][message.dataType].push(uuid);
                      }

                      index_count++;

                      return uuid;
                  }
                  return undefined;
              },
              delete: function (uuid) {
                  if (msngr.utils.exists(uuid) && msngr.utils.exists(id_to_message[uuid])) {
                      var message = id_to_message[uuid];

                      if (msngr.utils.exists(message.topic)) {
                          deleteValueFromArray(direct_index.topic_to_id[message.topic], uuid);

                          if (msngr.utils.exists(message.category)) {
                              deleteValueFromArray(direct_index.topic_cat_to_id[message.topic][message.category], uuid);
                          }

                          if (msngr.utils.exists(message.dataType)) {
                              deleteValueFromArray(direct_index.topic_type_to_id[message.topic][message.dataType], uuid);
                          }

                          if (msngr.utils.exists(message.category) && msngr.utils.exists(message.dataType)) {
                              deleteValueFromArray(direct_index.topic_cat_type_to_id[message.topic][message.category][message.dataType], uuid);
                          }
                      }

                      delete id_to_message[uuid];
                      index_count--;

                      return true;
                  }
              },
              query: function (message) {
                  if (msngr.utils.exists(message)) {
                      if (msngr.utils.exists(message.topic)) {
                          // Topic Only Results
                          if (!msngr.utils.exists(message.category) && !msngr.utils.exists(message.dataType)) {
                              return direct_index.topic_to_id[message.topic] || [];
                          }

                          // Topic + Category Results
                          if (msngr.utils.exists(message.category) && !msngr.utils.exists(message.dataType)) {
                              return (direct_index.topic_cat_to_id[message.topic] || { })[message.category] || [];
                          }

                          // Topic + Data Type Results
                          if (msngr.utils.exists(message.dataType) && !msngr.utils.exists(message.category)) {
                              return (direct_index.topic_type_to_id[message.topic] || { })[message.dataType] || [];
                          }

                          // Topic + Category + Data Type Results
                          if (msngr.utils.exists(message.category) && msngr.utils.exists(message.dataType)) {
                              return ((direct_index.topic_cat_type_to_id[message.topic] || { })[message.category] || { })[message.dataType] || [];
                          }
                      }
                  }

                  return [];
              },
              clear: function () {
                  // Index for id to message objects
                  id_to_message = { };

                  // Direct index (no partials) for message
                  direct_index = {
                      topic_to_id: { },
                      topic_cat_to_id: { },
                      topic_type_to_id: { },
                      topic_cat_type_to_id: { }
                  };

                  index_count = 0;

                  return true;
              },
              count: function () {
                  return index_count;
              }
          }
      }
  };
}()));
