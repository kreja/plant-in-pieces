'use strict';

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('web-component-tester');

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'public'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    concurrent: {
      target: {
        tasks: ['browserSync','watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    nodemon:{
      dev: {
        script: 'app.js',
        options: {
          nodeArgs: ['--harmony'],
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });
            nodemon.on('restart', function (e) {
              console.log('Restart Trigger: ',e);
            });
          },
          ignore: ['app/**','node_modules/**','public/**','views/**']
        }
      }
    },
    watch: {
      options: {
        spawn: false // Important, don't remove this!
      },
      jade: {
        files: [
          '<%= yeoman.app %>/elements/{,*/}*.jade'
        ],
        tasks: ['jade']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint','copy:scripts']
      },
      styles: {
        files: [
          '<%= yeoman.app %>/styles/{,*/}*.css',
          '<%= yeoman.app %>/elements/{,*/}*.css'
        ],
        tasks: ['copy:styles', 'autoprefixer']
      },
      sass: {
        files: [
          '<%= yeoman.app %>/styles/{,*/}*.{scss,sass}',
          '<%= yeoman.app %>/elements/{,*/}*.{scss,sass}'
        ],
        tasks: ['sass', 'autoprefixer']
      }
    },
    jade: {
      compile: {
        options: {
          pretty: true,
          data: {
            debug: false
          }
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: 'elements/{,*/}*.jade',
          dest: '<%= yeoman.dist %>',
          ext: '.html'
        }]
      }
    },
    compass: {                  // Task
      dist: {                   // Target
        // options: {              // Target options
        //   sassDir: ['<%= yeoman.app %>/styles/{,*/}*', '<%= yeoman.app %>/elements/{,*/}*'],
        //   cssDir: '<%= yeoman.dist %>',
        //   environment: 'production'
        // },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['styles/{,*/}*.{scss,sass}', 'elements/{,*/}*.{scss,sass}'],
          dest: '<%= yeoman.dist %>',
          ext: '.css'
        }]
      }
    },
    sass: {
      options: {
        loadPath: 'bower_components',
        compass: true
      },
      dist: {
        options: {
          style: 'compressed'
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['styles/{,*/}*.{scss,sass}', 'elements/{,*/}*.{scss,sass}'],
          dest: '<%= yeoman.dist %>',
          ext: '.css'
        }]
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['**/*.css', '!bower_components/**/*.css'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    browserSync: {
      app: {
        options: {
          injectChanges: false,//can't inject Shadow DOM, so this is important when using shadow dom
          proxy: "http://localhost:3000"
          // watchTask: true
        },
        bsFiles: {
          src : [
            '<%= yeoman.app %>/**/*.{css,html,js}',
            '<%= yeoman.dist %>/**/*.{css,html,js}',
            'views/**/*.jade'
          ]
        }
      }
    },
    clean: {
      dist: ['public', '<%= yeoman.dist %>/*']
    },
    jshint: {
      // options: {
      //   jshintrc: '.jshintrc',
      //   reporter: require('jshint-stylish')
      // },
      all: [
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },
    // useminPrepare: {
    //   html: '<%= yeoman.app %>/index.html',
    //   options: {
    //     dest: '<%= yeoman.dist %>'
    //   }
    // },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    // replace: {
    //   dist: {
    //     options: {
    //       patterns: [{
    //         match: /elements\/elements\.html/g,
    //         replacement: 'elements/elements.vulcanized.html'
    //       }]
    //     },
    //     files: {
    //       '<%= yeoman.dist %>/index.html': ['<%= yeoman.dist %>/index.html']
    //     }
    //   }
    // },
    // vulcanize: {
    //   default: {
    //     options: {
    //       strip: true,
    //       inline: true
    //     },
    //     files: {
    //       '<%= yeoman.dist %>/elements/elements.vulcanized.html': [
    //         '<%= yeoman.dist %>/elements/elements.html'
    //       ]
    //     }
    //   }
    // },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,svg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    minifyHtml: {
      options: {
        quotes: true,
        empty: true,
        spare: true
      },
      app: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: '*.html',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.html',
            'elements/**',
            '!elements/**/*.scss',
            'images/**',
            'scripts/**'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: ['bower_components/**']
        }]
      },
      styles: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: ['{styles,elements}/{,*/}*.css']
        }]
      },
      scripts: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: ['scripts/{,*/}*.js']
        }]
      }
    }
  });

  grunt.registerTask('serve', [
    // 'clean', data 不能 clean
    'jade',
    'sass',
    'copy',
    // 'useminPrepare',
    // 'imagemin',
    // 'concat',
    'autoprefixer',
    // 'uglify',
    // 'vulcanize',
    'usemin',
    // 'replace',
    'minifyHtml',
    'concurrent:target'
  ]);

  grunt.registerTask('node', [
    'nodemon'
  ]);

  grunt.registerTask('outcompass', [
    'compass'
  ]);
};
