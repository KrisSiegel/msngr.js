msngr.extend((function () {
  "use strict";

  // Index for id to message objects
  var id_to_message = { };

  // Direct index (no partials) for message
  var message_topic_to_ids = { };
  var message_category_to_ids = { };
  var message_dataType_to_ids = { };

  // Message index count
  var index_count = 0;

  var directIndexIndex = function (index, fieldValue, uuid) {
      if (!msngr.utils.exists(index[fieldValue])) {
          index[fieldValue] = [];
      }
      if (index[fieldValue].indexOf(uuid) === -1) {
          index[fieldValue].push(uuid);
          return true;
      }

      return false;
  };

  var directIndexDelete = function (index, fieldValue, uuid) {
      if (msngr.utils.exists(index[fieldValue]) && index[fieldValue].indexOf(uuid) !== -1) {
          var inx = index[fieldValue].indexOf(uuid);
          var endIndex = index[fieldValue].length - 1;
          if (inx !== endIndex) {
              var temp = index[fieldValue][endIndex];
              index[fieldValue][endIndex] = index[fieldValue][inx];
              index[fieldValue][inx] = temp;
          }
          index[fieldValue].pop();
      }
  }

  return {
      stores: {
          memory: {
              index: function (message) {
                  if (msngr.utils.exists(message)) {
                      var uuid = msngr.utils.id();
                      id_to_message[uuid] = message;

                      if (msngr.utils.exists(message.topic)) {
                          directIndexIndex(message_topic_to_ids, message.topic, uuid);
                      }

                      if (msngr.utils.exists(message.category)) {
                          directIndexIndex(message_category_to_ids, message.category, uuid);
                      }

                      if (msngr.utils.exists(message.dataType)) {
                          directIndexIndex(message_dataType_to_ids, message.dataType, uuid);
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
                          directIndexDelete(message_topic_to_ids, message.topic, uuid);
                      }

                      if (msngr.utils.exists(message.category)) {
                          directIndexDelete(message_category_to_ids, message.category, uuid);
                      }

                      if (msngr.utils.exists(message.dataType)) {
                          directIndexDelete(message_dataType_to_ids, message.dataType, uuid);
                      }

                      delete id_to_message[uuid];
                      index_count--;

                      return true;
                  }
              },
              query: function (message) {
                  if (msngr.utils.exists(message)) {

                      if (msngr.utils.exists(message.topic)) {

                      }

                      if (msngr.utils.exists(message.category)) {

                      }

                      if (msngr.utils.exists(message.dataType)) {

                      }
                  }
              },
              clear: function () {
                  // Index for id to message objects
                  id_to_message = { };

                  // Direct index (no partials) for message
                  message_topic_to_ids = { };
                  message_category_to_ids = { };
                  message_dataType_to_ids = { };

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
