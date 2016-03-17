'use strict';

var gulp = require('gulp');
var Server = require('karma').Server;
var bower = require('gulp-bower');


var config = {
    paths: {
        libs: './django_querybuilder/static/libs/',
        static: {
            folders: ['django_querybuilder/static']
        }
    }
};

/**
 * Install Bower dependencies
 */
gulp.task('bower', function() {
    return bower();
});

/**
 * Move dependencies
 */
gulp.task('dependencies', ['bower'] , function() {
    return gulp.src('bower_components/**/*').pipe(gulp.dest(config.paths.libs));
});

/**
 * Run test once and exit
 */
gulp.task('test', function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    logLevel: "info"
  }, done).start();
});

/**
 * The default task (called when you run `gulp` from cli)
 */
gulp.task('default', ['test']);