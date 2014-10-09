msngr.registry.binders.add((function () {
    var index = { };
    var indexCount = 0;

    var eventHelpers = {

    };

    var listener = function (event) {
        var node = this;
        var path = msngr.utils.getDomPath(node);

        if (index[path] !== undefined) {
            if (index[path][event.type] !== undefined) {
                var mgs = index[path][event.type];
                for (var i = 0; i < mgs.length; ++i) {
                    var m = mgs[i];
                    m.payload = (eventHelpers[event.type] !== undefined) ? eventHelpers[event.type](event) : event;
                    msngr.emit(m);
                }
            }
        }
    };

    return {
        domain: "dom",
        bind: function (element, event, message) {
            var node = msngr.utils.findElement(element);
            var path = msngr.utils.getDomPath(node);

            index[path] = index[path] || { };
            index[path][event] = index[path][event] || [];

            index[path][event].push(message);
            indexCount = indexCount + 1;
            node.addEventListener(event, listener);

        },
        unbind: function (element, event, message) {
            var node = msngr.utils.findElement(element);
            var path = msngr.utils.getDomPath(node);

            if (index[path] !== undefined) {
                if (index[path][event] !== undefined) {
                    var mgs = index[path][event];
                    for (var i = 0; i < mgs.length; ++i) {
                        if (msngr.utils.isMessageMatch(message, mgs[i])) {
                            index[path][event].splice(i, 1);
                            node.removeEventListener(event, listener);
                            indexCount = indexCount - 1;
                            break;
                        }
                    }
                }
            }
        },
        count: function () {
            return indexCount;
        }
    };
}()));
