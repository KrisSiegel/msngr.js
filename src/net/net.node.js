msngr.extend((function(external, internal) {
    "use strict";
    
    internal.net = internal.net || { };
    // This method handles requests when msngr is running within node.js
    internal.net.node = function(server, options, callback) {
        var http = require("http");
        var request = http.request({
            method: options.method,
            host: server.host,
            port: server.port,
            path: options.path,
            headers: options.headers
        }, function(response) {
            response.setEncoding("utf8");
            var body = "";
            response.on("data", function(chunk) {
                body = body + chunk;
            });

            response.on("end", function() {
                var obj;
                if (options.autoJson === true && (response.headers["content-type"] || "").toLowerCase() === "application/json") {
                    try {
                        obj = JSON.parse(body);
                    } catch (ex) {
                        // Don't do anything; probably wasn't JSON anyway
                        // Set obj to undefined just incase it contains something awful
                        obj = undefined;
                    }
                }
                obj = obj || body;
                var errObj;
                if (request.statusCode >= 400) {
                        errObj = {
                        status: request.statusCode,
                        response: (obj || body)
                    };
                    obj = null;
                }
                if (external.is(callback).there) {
                    callback.apply(undefined, [errObj, obj]);
                }
            });
        });

        if (external.is(options.payload).there) {
            var datum;
            if (external.is(options.payload).object) {
                try {
                    datum = JSON.stringify(options.payload);
                } catch (ex) {
                    // Really couldn't give a shit about this exception
                }
            }

            // undefined has no meaning in JSON but null does; so let's only
            // and explicitly set anything if it's still undefined (so no null checks)
            if (datum === undefined) {
                datum = options.payload;
            }

            request.write(datum);
        }

        request.end();
    };
}));
