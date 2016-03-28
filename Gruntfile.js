module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      files: ["Gruntfile.js"]
    },
    watch: {
      scripts: {
        files: ["client/**/*.js"],
        tasks: ["browserify"],
        options: {
          spawn: false
        }
      }
    },
    browserify: {
      dist: {
        files: {
          'client/dist/bundle.js': ["client/js/*.jsx"]
        },
        options: {
          debug: true,
          transform: [
           [
           'reactify', {'es6': true}
           ]
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-reactify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint', 'browserify', 'watch']);
};
