msngr.extend((function(external, internal) {
    "use strict";

    var browser = function(method, fullpath, callback) {
        try {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        callback.apply(undefined, [null, xhr.response]);
                    } else {
                        callback.apply(undefined, [xhr.response, null]);
                    }
                }
            };

            xhr.open(method, fullpath);
            xhr.send();
        } catch (ex) {
            callback.apply(undefined, [ex, null]);
        }
    };

    var node = function(method, host, path, callback) {
        var http = require("http");
        var request = http.request({
            method: method,
            host: host,
            path: path,
            agent: false
        }, function(response) {
            response.setEncoding("utf8");
            var body = "";
            response.on("data", function(chunk) {
                body = body + chunk;
            });

            response.on("end", function() {
                var obj;
                try {
                    obj = JSON.parse(body);
                } catch (ex) {
                    // Don't do anything; probably wasn't JSON anyway
                }

                callback.apply(undefined, [null, obj || body]);
            });
        });

        request.end();
    };

    var request = function(method, host, path, callback) {
        if (external.isBrowser()) {
            // Use web browser comms
            browser(method, (host + path), callback);
        } else {
            // Use node comms
            node(method, host, path, callback);
        }
    };

    return {
        web: function(host) {
            if (external.isEmptyString(host)) {
                throw internal.InvalidParametersException("web");
            }

            return {
                get: function(path, callback) {
                    request("get", host, path, callback);
                },
                post: function(path, callback) {
                    request("post", host, path, callback);
                },
                put: function(path, callback) {
                    request("put", host, path, callback);
                },
                delete: function(path, callback) {
                    request("delete", host, path, callback);
                }
            };
        }
    };
}));
