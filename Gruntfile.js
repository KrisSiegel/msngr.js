module.exports = (function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-mocha-test');
	var paths = [
		"src/main.js",
		"src/emitters/*.js",
		"src/receivers/*.js",
		"src/routers/*.js",
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
				src: ["./test/*.spec.js"]
			}
		}
	});
	grunt.registerTask("build", ["clean", "concat", "uglify:minify", "mochaTest"]);
	grunt.registerTask("test", ["mochaTest"]);
});