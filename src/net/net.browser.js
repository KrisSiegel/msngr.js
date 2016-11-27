msngr.extend((function(external, internal) {
    "use strict";
    
    internal.net = internal.net || { };
    // This method handles requests when msngr is running within a semi-modern net browser
    internal.net.browser = function(server, options, callback) {
        try {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        var obj;
                        if (options.autoJson === true && (this.getResponseHeader("content-type") || "").toLowerCase() === "application/json") {
                            try {
                                obj = JSON.parse(xhr.response);
                            } catch (ex) {
                                // Don't do anything; probably wasn't JSON anyway
                                // Set obj to undefined just incase it contains something awful
                                obj = undefined;
                            }
                        }
                        if (external.is(callback).there) {
                            callback.apply(undefined, [null, (obj || xhr.response)]);
                        }
                    } else {
                        var errObj = {
                            status: xhr.status,
                            response: xhr.response
                        };
                        if (external.is(callback).there) {
                            callback.apply(undefined, [errObj, null]);
                        }
                    }
                }
            };

            var url = server.protocol + "://" + server.host;
            if (server.canOmitPort === true) {
                url = url + options.path;
            } else {
                url = url + ":" + server.port + options.path;
            }

            var datum;
            if (external.is(options.payload).there) {
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
            }

            xhr.open(options.method, url, true);
            if (external.is(options.headers).there) {
                for (var key in options.headers) {
                    if (options.headers.hasOwnProperty(key)) {
                        xhr.setRequestHeader(key, options.headers[key]);
                    }
                }
            }
            xhr.send(datum);
        } catch (ex) {
            if (external.is(callback).there) {
                callback.apply(undefined, [ex, null]);
            }
        }
    };
}));
