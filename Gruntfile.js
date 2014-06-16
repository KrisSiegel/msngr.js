module.exports = (function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-mocha-test');
	var paths = [
		"src/main.js",
		"src/utils/*.js",
		"src/registry.js",
		"src/routers/*.js",
		"src/binders/*.js",
		"src/emitters/*.js",
		"src/receivers/*.js",
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
					"./test/*.any.spec.js",
					"./test/*.node.spec.js"
				]
			}
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
				if (file.indexOf(".js") !== undefined) {
					delete require.cache[path.resolve(__dirname, "msngr.js")];
					delete require.cache[path.resolve(__dirname, "msngr.min.js")];
					require("./stress/" + file)(done);
					console.log("");
				}
			}
		};

		done();
	});
	grunt.registerTask("build", ["clean", "verisionify", "concat", "uglify:minify", "mochaTest"]);
	grunt.registerTask("test", ["mochaTest"]);
});
