module.exports = (function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-mocha-phantomjs');

	var paths = [
		"src/main.js",
		"src/utils/*.js",
		"src/registry.js",
		"src/routers/*.js",
		"src/binders/*.js",
		"src/api/*.js",
		"src/module.exports.js"
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
					compress: true
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
					"**/*.any.spec.js",
					"**/*.node.spec.js"
				]
			}
		},
		mocha_phantomjs: {
			all: ["specRunner.html"]
		}
	});

	grunt.registerTask("verisionify", "Verisionifying msngr.js", function () {
		var fs = require("fs");
		var pkg = grunt.file.readJSON('package.json');

		var main = fs.readFileSync("src/main.js", { encoding: "utf8" });
		var indexOfVersion = main.indexOf("version: ");
		var indexOfNextComma = main.indexOf(",", indexOfVersion);
		var ified = main.substring(0, indexOfVersion);
		ified = ified + "version: \"" + pkg.version + "\"";
		ified = ified + main.substring(indexOfNextComma, main.length);

		fs.writeFileSync("src/main.js", ified, { encoding: "utf8" });
	});

	grunt.registerTask("stress", "Stress test", function () {
		var fs = require("fs");
		var path = require("path");
		var items = fs.readdirSync("./stress");

		var done = function () {
			if (items.length > 0) {
				var file = items.shift();
				if (file.indexOf(".js") !== -1) {
					delete require.cache[path.resolve(__dirname, "msngr.js")];
					delete require.cache[path.resolve(__dirname, "msngr.min.js")];
					require("./stress/" + file)(done);
				}
			}
		};

		done();
	});

	grunt.registerTask("setRunner", "Set the client side spec runner", function () {
		var makeScript = function (path) {
			return "<script type='text/javascript' src='" + path + "'></script>";
		};
		var fs = require("fs");
		var path = require("path");
		var tests = [];
		var dirs = fs.readdirSync("./");

		for (var i = 0; i < dirs.length; ++i) {
			if (fs.statSync(dirs[i]).isDirectory()) {
				var files = fs.readdirSync(dirs[i]);
				for (var j = 0; j < files.length; ++j) {
					tests.push(path.join("./", dirs[i], files[j]));
				}
			}
		}

		var scriptHtml = "";

		if (tests !== undefined && tests.length > 0) {
			var file = tests.shift();
			while (tests.length > 0) {
				if (file.indexOf(".client.spec.js") !== -1 || file.indexOf(".any.spec.js") !== -1) {
					scriptHtml += makeScript(file) + "\n";
				}
				file = tests.shift();
			}
		}

		var runnerHtml = fs.readFileSync("./specRunner.html", { encoding: "utf8" });
		var scriptStart = runnerHtml.indexOf("<!-- Start Unit Tests -->");
		var scriptEnd = runnerHtml.indexOf("<!-- End Unit Tests -->");

		var newHtml = runnerHtml.substring(0, scriptStart);
		newHtml += "<!-- Start Unit Tests -->";
		newHtml += scriptHtml;
		newHtml += runnerHtml.substring(scriptEnd);

		fs.writeFileSync("./specRunner.html", newHtml, { encoding: "utf8" });
	});

	grunt.registerTask("build", ["clean", "verisionify", "concat", "uglify:minify", "setRunner"]);
	grunt.registerTask("test", ["mochaTest", "mocha_phantomjs"]);
});
