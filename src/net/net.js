msngr.extend((function(external, internal) {
    "use strict";

    // Setup constants
    var defaults = {
        path: "/",
        protocol: "http",
        port: {
            http: "80",
            https: "443"
        },
        autoJson: true
    };

    // This method handles requests when msngr is running within a semi-modern net browser
    var browser = function(server, options, callback) {
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

    // This method handles requests when msngr is running within node.js
    var node = function(server, options, callback) {
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

    var request = function(server, opts, callback) {
        if (external.is(opts.query).there) {
            if (external.is(opts.query).string) {
                opts.queryString = opts.query;
            }

            if (external.is(opts.query).object) {
                opts.queryString = "?";
                for (var key in opts.query) {
                    if (opts.query.hasOwnProperty(key)) {
                        if (opts.queryString !== "?") {
                            opts.queryString = opts.queryString + "&";
                        }
                        opts.queryString = opts.queryString + encodeURIComponent(key) + "=" + encodeURIComponent(opts.query[key]);
                    }
                }
            }
        }

        opts.path = opts.path + (opts.queryString || "");

        if (external.is.browser) {
            browser(server, opts, callback);
        } else {
            node(server, opts, callback);
        }
    };

    // This method is crazy; tries to figure out what the developer sent to
    // the net() method to allow maximum flexibility. Normalization is important here.
    var figureOutServer = function(protocol, host, port) {
        var server = { protocol: undefined, host: undefined, port: undefined, canOmitPort: false };
        var handled = false;
        var invalid = false;
        var invalidReason;

        if (external.is(protocol).empty) {
            invalid = true;
            invalidReason = "Protocol or host not provided";
        }

        if (!invalid && !external.is(protocol).empty && external.is(host).empty && external.is(port).empty) {
            // Only one argument was provided; must be whole host.
            var split = protocol.split("://");
            if (split.length == 2) {
                server.protocol = split[0];
                server.host = split[1];
            } else {
                // Must have omitted protocol.
                server.host = protocol;
                server.protocol = defaults.protocol;
            }

            var lastColon = server.host.lastIndexOf(":");
            if (lastColon !== -1) {
                // There is a port; let's grab it!
                server.port = server.host.substring(lastColon + 1, server.host.length);
                server.host = server.host.substring(0, lastColon);
            } else {
                // There ain't no port!
                server.port = defaults.port[server.protocol];
            }

            handled = true;
        }

        if (!invalid && !handled && !external.is(protocol).empty && !external.is(host).empty && external.is(port).empty) {
            // Okay, protocol and host are provided. Figure out port!
            server.protocol = protocol;
            server.host = host;

            var lastColon = server.host.lastIndexOf(":");
            if (lastColon !== -1) {
                // There is a port; let's grab it!
                server.port = server.host.substring(lastColon + 1, server.host.length);
                server.host = server.host.substring(0, lastColon);
            } else {
                // There ain't no port!
                server.port = defaults.port[server.protocol];
            }

            handled = true;
        }

        if (!invalid && !handled && !external.is(protocol).empty && !external.is(host).empty && !external.is(port).empty) {
            // Everything is provided. Holy shit, does that ever happen!?
            server.protocol = protocol;
            server.host = host;
            server.port = port;

            handled = true;
        }

        // Port explicitness can be omitted for some protocols where the port is their default
        // so let's mark them as can be omitted. This will make output less confusing for
        // more inexperienced developers plus it looks prettier :).
        if (!invalid && handled && defaults.port[server.protocol] === server.port) {
            server.canOmitPort = true;
        }

        if (!invalid && !handled) {
            // Well we didn't handle the input but also didn't think it was invalid. Crap!
            invalid = true;
            invalidReason = "Unable to handle input into method. Please open a GitHub issue with your input :)";
        }

        if (invalid === true) {
            throw internal.InvalidParametersException("net", invalidReason);
        }

        // Strip any supplied paths
        var stripPath = function(input) {
            var index = input.indexOf("/");
            return input.substring(0, ((index === -1) ? input.length : index));
        };

        server.host = stripPath(server.host);
        server.port = stripPath(server.port);

        return server;
    };

    external.net = function(protocol, host, port) {
        var server = figureOutServer(protocol, host, port);

        var netObj = {
            get: function(options, callback) {
                var opts = internal.merge(external.copy(defaults), options);
                opts.method = "get";
                request(server, opts, callback);
            },
            post: function(options, callback) {
                var opts = internal.merge(external.copy(defaults), options);
                opts.method = "post";
                request(server, opts, callback);
            },
            put: function(options, callback) {
                var opts = internal.merge(external.copy(defaults), options);
                opts.method = "put";
                request(server, opts, callback);
            },
            delete: function(options, callback) {
                var opts = internal.merge(external.copy(defaults), options);
                opts.method = "delete";
                request(server, opts, callback);
            },
            options: function(options, callback) {
                var opts = internal.merge(external.copy(defaults), options);
                opts.method = "options";
                request(server, opts, callback);
            }
        };

        Object.defineProperty(netObj, "protocol", {
            get: function() {
                return server.protocol;
            }
        });

        Object.defineProperty(netObj, "host", {
            get: function() {
                return server.host;
            }
        });

        Object.defineProperty(netObj, "port", {
            get: function() {
                return server.port;
            }
        });

        return netObj;
    };
}));
