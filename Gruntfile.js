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
        "src/validators/*.js",
        "src/utils/*.js",
        "src/mutators/*.js",
        "src/messaging/*.js",
        "src/middlewares/*.js",
        "src/module.exports.js",
        "!**/*.aspec.js",
        "!**/*.cspec.js",
        "!**/*.nspec.js"
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
                options: {
                    sourceMap: false,
                    compress: { },
                    mangle: {
                        reserved: ["msngr"]
                    }
                },
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

    grunt.registerTask("header:clientTesting", function() {
        grunt.log.subhead("Client-side unit testing with phantom.js");
    });

    var jsPaths = ["./", "./src/"];
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

    /*
    	'build' and 'test' are rolled-up tasks; they have specific descriptions and execute
    	multiple tasks each to accomplish their goals. These are the only intended tasks
        to be run by the developer.
        
        build -> cleans then builds a new copy of `msngr.js` and `msngr.min.js`.
        test -> executes tests against the `msngr.js` and `msngr.min.js` rolled-up builds.
    */
    grunt.registerTask("build", "Cleans, sets version and builds msngr.js", ["header:building", "clean", "verisionify", "concat", "uglify:minify", "setRunner"]);

    grunt.registerTask("test", "Cleans, sets version, builds and runs mocha unit tests through node.js and phantom.js", ["header:nodeTesting", "mochaTest", "header:clientTesting", "mocha_phantomjs"]);

});
