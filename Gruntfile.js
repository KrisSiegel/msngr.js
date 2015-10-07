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
    */
    var paths = [
        "src/main.js",
        "src/utils/*.js",
        "src/store/*.js",
        "src/objects/*.js",
        "src/messengers/*.js",
        "src/options/*.js",
        "src/module.exports.js",
        "!**/*.aspec.js",
        "!**/*.cspec.js",
        "!**/*.nspec.js"
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
                    mangle: false,
                    preserveComments: false,
                    compress: {}
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
                    "**/*.aspec.js",
                    "**/*.nspec.js"
                ]
            }
        },
        mocha_phantomjs: {
            all: ["specRunner.html", "specRunner.min.html"]
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

    /*
    	The setRunner task modifies the specRuner.html file, dynamically, with the
    	unit tests within the project to allow test running with phantomjs.
    */
    grunt.registerTask("setRunner", "Set the client side spec runner", function() {
        var makeScript = function(path) {
            return "<script type='text/javascript' src='" + path + "'></script>";
        };
        var fs = require("fs");
        var path = require("path");

        var tests = [];
        var testPaths = ["./", "./src/", "./docs/"];

        for (var k = 0; k < testPaths.length; ++k) {
            var dirs = fs.readdirSync(testPaths[k]);

            for (var i = 0; i < dirs.length; ++i) {
                if (fs.statSync(testPaths[k] + dirs[i]).isDirectory()) {
                    var files = fs.readdirSync(testPaths[k] + dirs[i]);
                    for (var j = 0; j < files.length; ++j) {
                        var p = path.join("./", testPaths[k], dirs[i], files[j]);
                        if (tests.indexOf(p) === -1) {
                            tests.push(p);
                        }
                    }
                } else {
                    var p = path.join("./", testPaths[k], dirs[i]);
                    if (tests.indexOf(p) === -1) {
                        tests.push(p);
                    }
                }
            }
        }

        var scriptHtml = "";

        if (tests !== undefined && tests.length > 0) {
            var file = tests.shift();
            while (tests.length > 0) {
                if (file.indexOf(".cspec.js") !== -1 || file.indexOf(".aspec.js") !== -1) {
                    scriptHtml += makeScript(file) + "\n";
                }
                file = tests.shift();
            }
        }

        var runnerHtml = fs.readFileSync("./specRunner.html", {
            encoding: "utf8"
        });
        var scriptStart = runnerHtml.indexOf("<!-- Start Unit Tests -->");
        var scriptEnd = runnerHtml.indexOf("<!-- End Unit Tests -->");

        var newHtml = runnerHtml.substring(0, scriptStart);
        newHtml += "<!-- Start Unit Tests -->";
        newHtml += scriptHtml;
        newHtml += runnerHtml.substring(scriptEnd);

        fs.writeFileSync("./specRunner.html", newHtml, {
            encoding: "utf8"
        });
        fs.writeFileSync("./specRunner.min.html", newHtml, {
            encoding: "utf8"
        });
    });

    /*
    	'build' and 'test' are roll-up tasks; they have specific descriptions and execute
    	multiple tasks each to accomplish their goals. These are the only intended tasks
    	to be run by the developer.
    */

    grunt.registerTask("build", "Cleans, sets version and builds msngr.js", ["header:building", "clean", "verisionify", "concat", "uglify:minify", "setRunner"]);

    grunt.registerTask("test", "Cleans, sets version, builds and runs mocha unit tests through node.js and phantom.js", ["build", "header:nodeTesting", "mochaTest", "header:clientTesting", "mocha_phantomjs"]);

});
