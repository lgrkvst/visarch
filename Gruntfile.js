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
		},
	    markdown: {
	      options: {
	        template: 'docs_template/index.template'
			},
	      all: {
	        files: [
	          {
	            expand: true,
	            src: 'docs_template/*.md',
	            dest: 'docs/',
				flatten: true,
	            ext: '.html'
	          }
	        ]
	      }
	    },
		copy: {
			main: {
				files: [
			        {expand: true, flatten:true, src: ['bower/d3/d3.min.js'], dest: 'js/lib/'},
			        {expand: true, flatten:true, src: ['bower/jquery/jquery.min.js'], dest: 'js/lib/'},
			        {expand: true, flatten:true, src: ['bower/bootstrap/dist/js/bootstrap.min.js'], dest: 'js/lib/'},
			        {expand: true, flatten:true, src: ['bower/bootstrap-switch/static/js/bootstrap-switch.min.js'], dest: 'js/lib/'},
			        {expand: true, flatten:true, src: ['bower/typeahead.js/dist/typeahead.min.js'], dest: 'js/lib/'},
			        {expand: true, flatten:true, src: ['bower/hogan/web/builds/2.0.0/hogan-2.0.0.min.js'], dest: 'js/lib/'},
			        {expand: true, flatten:true, src: ['bower/bootstrap/dist/css/bootstrap.min.css'], dest: 'css/lib/'},
			        {expand: true, flatten:true, src: ['bower/bootstrap-switch/static/stylesheets/bootstrap-switch.css'], dest: 'css/lib/'},
			        {expand: true, flatten:true, src: ['bower/jquery.avgrund/jquery.avgrund.min.js'], dest: 'js/lib/'},
			        {expand: true, flatten:true, src: ['bower/jquery.avgrund/style/avgrund.css'], dest: 'css/lib/'},
			        {expand: true, flatten:true, src: ['bower/bootstrap/dist/fonts/*'], dest: 'css/fonts/'}
				]
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
	grunt.loadNpmTasks('grunt-markdown');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Task(s).
	grunt.registerTask('default', ['uglify']);
	grunt.registerTask('explain_docs', ['explainjs']);
	grunt.registerTask('hint', ['jshint']);
	grunt.registerTask('fix', ['fixmyjs']);
	grunt.registerTask('docs', ['dox']);
	grunt.registerTask('md', ['markdown']);
	grunt.registerTask('build', ['copy', 'dox', 'md']);
	grunt.registerTask('cp', ['copy']);
};
