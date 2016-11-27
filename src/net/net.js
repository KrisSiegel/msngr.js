msngr.extend((function(external, internal) {
    "use strict";

    internal.net = internal.net || { };
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
            internal.net.browser(server, opts, callback);
        } else {
            internal.net.node(server, opts, callback);
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
