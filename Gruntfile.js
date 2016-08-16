module.exports = (function(grunt) {
    "use strict";

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-available-tasks');

    // Get rid of the header output nonsense from grunt (they should really fix this)
    grunt.log.header = function() {};

    /*
    	These are the paths to include or exclude in concatenation and minification steps.
        The order here is important at some code references other code in other files.
    */
    var paths = [
        "src/main.js",
        "src/exceptional.js",
        "src/validators/*.js",
        "src/utils/*.js",
        "src/mutators/*.js",
        "src/messaging/*.js",
        "src/mache/*.js",
        "src/net/*.js",
        "src/module.exports.js",
        "!**/*.aspec.js",
        "!**/*.cspec.js",
        "!**/*.nspec.js",
        "!**/*.bench.js"
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: ["./msngr.js", "./msngr.min.js"],
        concat: {
            dist: {
                src: paths,
                dest: "./msngr.js"
            }
        },
        uglify: {
            minify: {
                options: { },
                files: {
                    "./msngr.min.js": paths
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: "spec"
                },
                src: [
                    "./src/**/*.aspec.js",
                    "./src/**/*.nspec.js"
                ]
            }
        },
        mocha_phantomjs: {
            options: {
                phantomConfig:{
                    "--web-security": false
                }
            },
            files: {
                src: ["test/specRunner.html", "test/specRunner.min.html"]
            }
        },
        availabletasks: {
            tasks: {
                options: {
                    filter: "include",
                    tasks: ["build", "test"]
                }
            }
        }
    });

    grunt.registerTask("default", ["availabletasks"]);

    /*
    	Grabs the version specified in `package.json` and writes it into the main.js file.
    */
    grunt.registerTask("verisionify", "Verisionifying msngr.js", function() {
        var fs = require("fs");
        var pkg = grunt.file.readJSON('package.json');

        var main = fs.readFileSync("src/main.js", {
            encoding: "utf8"
        });
        var indexOfVersion = main.indexOf("external.version = ");
        var indexOfNextSemiColon = main.indexOf(";", indexOfVersion);
        var ified = main.substring(0, indexOfVersion);
        ified = ified + "external.version = \"" + pkg.version + "\"";
        ified = ified + main.substring(indexOfNextSemiColon, main.length);

        fs.writeFileSync("src/main.js", ified, {
            encoding: "utf8"
        });
    });

    /*
    	Grunt is kinda funky; these header:* tasks just print out pretty headers.
    */
    grunt.registerTask("header:building", function() {
        grunt.log.subhead("Building msngr.js");
    });

    grunt.registerTask("header:stressing", function() {
        grunt.log.subhead("Running stress tests with node.js");
    });

    grunt.registerTask("header:nodeTesting", function() {
        grunt.log.subhead("Unit testing with node.js");
    });

    grunt.registerTask("header:nodeBenching", function() {
        grunt.log.subhead("Benchmarking with node.js");
    });

    grunt.registerTask("header:clientTesting", function() {
        grunt.log.subhead("Client-side unit testing with phantom.js");
    });

    var jsPaths = ["./", "./src/", "./docs/"];
    var fetchJsFiles = function(filters) {
        var fs = require("fs");
        var path = require("path");
        var results = [];

        for (var k = 0; k < jsPaths.length; ++k) {
            var dirs = fs.readdirSync(jsPaths[k]);

            for (var i = 0; i < dirs.length; ++i) {
                if (fs.statSync(jsPaths[k] + dirs[i]).isDirectory()) {
                    var files = fs.readdirSync(jsPaths[k] + dirs[i]);
                    for (var j = 0; j < files.length; ++j) {
                        var p = path.join("./", jsPaths[k], dirs[i], files[j]);
                        if (results.indexOf(p) === -1) {
                            results.push(p);
                        }
                    }
                } else {
                    var p = path.join("./", jsPaths[k], dirs[i]);
                    if (results.indexOf(p) === -1) {
                        results.push(p);
                    }
                }
            }
        }

        var filteredResults = [];
        for (var i = 0; i < results.length; ++i) {
            var include = false;
            for (var k = 0; k < filters.length; ++k) {
                if (results[i].indexOf(filters[k]) !== -1) {
                    include = true;
                    break;
                }
            }
            if (include) {
                filteredResults.push(results[i]);
            }
        }

        return filteredResults;
    };

    var setRunner = function(runner, files) {
        var fs = require("fs");
        var makeScript = function(path) {
            return "<script type='text/javascript' src='../" + path + "'></script>";
        };

        var scriptHtml = "";

        if (files !== undefined && files.length > 0) {
            var file = files.shift();
            while (file) {
                scriptHtml += makeScript(file) + "\n";
                file = files.shift();
            }
        }
        var runnerFileName = "./" + runner;
        var runnerHtml = fs.readFileSync(runnerFileName, {
            encoding: "utf8"
        });
        var scriptStart = runnerHtml.indexOf("<!-- Start JS Files -->");
        var scriptEnd = runnerHtml.indexOf("<!-- End JS Files -->");

        var newHtml = runnerHtml.substring(0, scriptStart);
        newHtml += "<!-- Start JS Files -->";
        newHtml += scriptHtml;
        newHtml += runnerHtml.substring(scriptEnd);

        fs.writeFileSync(runnerFileName, newHtml, {
            encoding: "utf8"
        });
        fs.writeFileSync(runnerFileName, newHtml, {
            encoding: "utf8"
        });
    };

    /*
    	The setRunner task modifies the specRuner.html file, dynamically, with the
    	unit tests within the project to allow test running with phantomjs.
    */
    grunt.registerTask("setRunner", "Set the client side spec runner", function() {
        var tests = fetchJsFiles([".cspec.js", ".aspec.js"]);
        setRunner("test/specRunner.html", tests.concat([]));
        setRunner("test/specRunner.min.html", tests.concat([]));
    });

    grunt.registerTask("run-benchmarks", "Finds all benchmarks and executes them", function() {
        var async = require("async")
        var done = this.async();

        // Make a list of benchmark files to run
        var benchmarks = fetchJsFiles([".bench.js"]);

        // Set HTML benchmark runners to use the list of benchmarks
        setRunner("test/benchRunner.html", benchmarks.concat([]));
        setRunner("test/benchRunner.min.html", benchmarks.concat([]));
        var meths = [];

        // Add each benchmark test to the set of methods of execute in series
        for (var i = 0; i < benchmarks.length; ++i) {
            meths.push(function(p) {
                return require(p);
            }("./" + benchmarks[i]));
        }

        // Execute all benchmarks in series
        async.series(meths, function (err, results) {
            done();
        });
    });

    /*
        The reflective server simply accepts JSON, parses it and echos what it received
        back to the client. Pretty useful when testing sending and receiving data.
    */
    grunt.registerTask("start-reflective-server", "Creates a test service with some dummy endpoints for testing", function() {
        var http = require("http");
        var server = http.createServer(function(request, response) {
            var body = "";
            request.on("data", function(chunk) {
                body = body + chunk;
            });

            request.on("end", function() {
                var result = {
                    method: request.method,
                    headers: request.headers,
                    path: request.url,
                    body: body
                };

                var headers = { };

                try {
                    var objBody = JSON.parse(body);
                    if (objBody.headers != undefined && Object.keys(objBody.headers).length > 0) {
                        for (var key in objBody.headers) {
                            headers[key] = objBody.headers[key];
                        }
                    }

                    if (objBody.body != undefined) {
                        result.body = objBody.body;
                    }
                } catch (ex) {
                    // Couldn't care less as opposed to the commonly misused "could care less"
                    // in which you actually do care a little. No, I couldn't care less because
                    // this error just means there are no commands to reflect :)
                }

                if (headers["content-type"] === undefined) {
                    headers["content-type"] = "application/json";
                }

                response.writeHead(200, headers);
                response.end(JSON.stringify(result, null, 2));
            });
        });

        server.listen("8009", "127.0.0.1", function(e) {
            console.log("Reflective http server started");
        });
    });

    /*
    	'build' and 'test' are roll-up tasks; they have specific descriptions and execute
    	multiple tasks each to accomplish their goals. These are the only intended tasks
    	to be run by the developer.
    */
    grunt.registerTask("build", "Cleans, sets version and builds msngr.js", ["header:building", "clean", "verisionify", "concat", "uglify:minify", "setRunner"]);

    grunt.registerTask("test", "Cleans, sets version, builds and runs mocha unit tests through node.js and phantom.js", ["build", "header:nodeTesting", "start-reflective-server", "mochaTest", "header:clientTesting", "mocha_phantomjs"]);

    grunt.registerTask("benchmark", "Cleans, sets version, builds and runs benchmarks through node.js", ["build", "header:nodeBenching", "run-benchmarks"]);

});
