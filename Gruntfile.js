module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			// define the files to lint
			files: ['js/ALL.js', 'js/Net.js'],
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options: {
				// more options here if you want to override JSHint defaults
				globals: {
					jQuery: true,
					console: true,
					module: true
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'js/*.js',
				dest: 'build/<%= pkg.name %>.min.js'
			}
		},
		explainjs: {
			options: {
				showFilename: true // default is false
			},
			files: [{
				src: 'js/*.js',
				dest: 'build/explain_ALL.html'
			}]
		},
		fixmyjs: {
			options: {
				// Task-specific options go here.
			},
			files: {
				expand: true,
				src: 'js/Net.js',
				dest: 'testing/'
			}
		},
		dox: {
		  options: {
		    title: 'the Observatory JS docs'
		  },
		  files: {
		    ignore: ['lib', 'libs'],
		    src: ['js/*.js'],
		    dest: 'docs'
		  }
		}
	});

	// Emma:visarch cla$ dox-foundation --source ./js --target dox-docs -i lib,libs

	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-explainjs');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-fixmyjs');
	grunt.loadNpmTasks('grunt-dox');

	// Task(s).
	grunt.registerTask('default', ['uglify']);
	grunt.registerTask('docs', ['explainjs']);
	grunt.registerTask('hint', ['jshint']);
	grunt.registerTask('fix', ['fixmyjs']);
	grunt.registerTask('docs', ['dox']);

};
