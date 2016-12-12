/*
    ./src/mache/mache.js

    A merge cache
*/

msngr.extend((function (external, internal) {
    "use strict";

    external.mache = function (opts) {
        opts = opts || { };
        var meta = {
            events: {
                onChange: {
                    topic: "msngr.mache",
                    category: "change",
                    emit: opts.emitChanges || false
                }
            },
            revisions: {
                toKeep: (opts.revisions || 3)
            }
        }
        var flatCache = { };
        var data = { };
        var transData = undefined;
        var transRemovals = undefined;
        var transacting = false;

        var normalGet = function (id) {
            if (data[id] === undefined) {
                return undefined;
            }
            return data[id][data[id].length - 1];
        };

        var transGet = function (id) {
            return (transRemovals[id] === true) ? undefined : (transData[id] || normalGet(id));
        };

        var normalSet = function (id, value) {
            if (data[id] === undefined) {
                data[id] = [];
            }

            data[id].push(internal.merge(external.copy(api.get(id)), external.copy(value)));
            flatCache[id] = api.get(id);

            if (data[id].length > meta.revisions.toKeep) {
                data[id].shift();
            }

            if (meta.events.onChange.emit) {
                var msg = external.message(meta.events.onChange.topic, meta.events.onChange.category, id);
                msg.emit({
                    id: id,
                    oldValue: data[id][data[id].length - 2],
                    newValue: data[id][data[id].length - 1]
                });
            }

            return true;
        };

        var transSet = function (id, value) {
            transData[id] = internal.merge((transData[id] || normalGet(id)), external.copy(value));
            return true;
        };

        var normalRemove = function (id) {
            if (data[id] === undefined) {
                return false;
            }

            delete data[id];
            delete flatCache[id];
            return true;
        };

        var transRemove = function (id) {
            if (transData[id] === undefined && data[id] === undefined) {
                return false;
            }

            if (transData[id] !== undefined) {
                delete transData[id];
            }

            transRemovals[id] = true;
            return true;
        };

        var normalRevert = function (id) {
            if (data[id] === undefined) {
                return false;
            }

            if (data[id].length === 1) {
                delete data[id];
                delete flatCache[id];
                return true;
            }

            data[id].pop();
            flatCache[id] = api.get(id);

            return true;
        };

        var api = {
            get: function (id) {
                return (transacting) ? transGet(id) : normalGet(id);
            },
            getDeep: function (id, property, defaultValue) {
                var obj = api.get(id);
                if (obj === undefined || external.is(property).empty) {
                    return defaultValue;
                }

                var keys = property.trim().split(".");
                var currentObj = obj;
                for (var i = 0; i < keys.length; ++i) {
                    if (currentObj[keys[i]] === undefined) {
                        return defaultValue;
                    }
                    currentObj = currentObj[keys[i]];
                }

                return (external.is(currentObj).there) ? currentObj : defaultValue;
            },
            set: function (id, value) {
                return (transacting) ? transSet(id, value) : normalSet(id, value);
            },
            remove: function (id) {
                return (transacting) ? transRemove(id) : normalRemove(id);
            },
            revert: function (id) {
                return (transacting) ? false : normalRevert(id);
            },
            begin: function () {
                if (transacting) {
                    // Shit we're already transacting!
                    return false;
                }
                transacting = true;
                transData = { };
                transRemovals = { };
                return true;
            },
            rollback: function () {
                if (!transacting) {
                    // How can we rollback outside of a transaction? ugh
                    return false;
                }
                transacting = false;
                transData = undefined;
                transRemovals = undefined;
                return true;
            },
            commit: function () {
                if (!transacting) {
                    // How can we commit outside of a transaction? ugh
                    return false;
                }

                transacting = false;
                for (var key in transData) {
                    if (transData.hasOwnProperty(key)) {
                        normalSet(key, transData[key]);
                    }
                }
                for (var key in transRemovals) {
                    if (transRemovals.hasOwnProperty(key)) {
                        normalRemove(key);
                    }
                }
                transData = undefined;
                transRemovals = undefined;
                return true;
            }
        };

        Object.defineProperty(api, "meta", {
            configurable: false,
            enumerable: false,
            get: function () {
                return meta;
            }
        });

        Object.defineProperty(api, "data", {
            configurable: false,
            enumerable: false,
            get: function () {
                return (transacting) ? internal.merge(external.copy(flatCache), transData) : flatCache;
            }
        });

        Object.defineProperty(api, "count", {
            configurable: false,
            enumerable: false,
            get: function () {
                return Object.keys(api.data).length;
            }
        });

        return api;
    };

    // Provide a mache instance for msngr.config.
    external.config = external.mache();
}));
