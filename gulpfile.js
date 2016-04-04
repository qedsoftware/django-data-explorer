'use strict';

var gulp = require('gulp');
var Server = require('karma').Server;
var bower = require('gulp-bower');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

var config = {
    paths: {
        libs: './django_querybuilder/static/libs/',
        static: {
            folders: ['django_querybuilder/static'],
            sass: '/sass/**/*.scss',
            css: '/css'
        },
        sass: function() {
            return config.paths.static.folders.map(function(folder) {
                return folder + config.paths.static.sass;
            });
        }
    },
    supported_browsers: [
        "Android 2.3",
        "Android >= 4",
        "Chrome >= 20",
        "Firefox >= 24",
        "Explorer >= 8",
        "iOS >= 6",
        "Opera >= 12",
        "Safari >= 6"
    ]
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
 * Build
 */
gulp.task('build', function() {
    var tasks = config.paths.static.folders.map(function(folder) {
        return gulp.src(folder + config.paths.static.sass)
            .pipe(sass().on('error', sass.logError))
            .pipe(postcss([autoprefixer({browsers: config.supported_browsers})]))
            .pipe(gulp.dest(folder + config.paths.static.css));
    });

    return tasks;
});

/**
 * Run build on file change
 */
gulp.task('watch', function() {
    gulp.watch(config.paths.sass(), ['build']);
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
gulp.task('default', ['watch', 'build']);