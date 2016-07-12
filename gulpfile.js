'use strict';

var gulp = require('gulp');
var Server = require('karma').Server;
var bower = require('gulp-bower');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var child_exec = require('child_process').exec;
var jshint = require('gulp-jshint');
var webpack = require('webpack-stream');
var webpack_config = require('./webpack.config.js');

var config = {
    paths: {
        libs: './django_querybuilder/static/django_querybuilder/libs/',
        static: {
            folder: 'django_querybuilder/static/django_querybuilder',
            sass: '/sass/**/*.scss',
            css: '/css',
            dist: '/dist',
            js: '/js/**/*.js'
        },
        js_tests: 'js_tests/public/*.js',
        sass: function() {
            return config.paths.static.folder + config.paths.static.sass;
        },
        js: function() {
            return config.paths.static.folder + config.paths.static.js;
        },
        dist: function() {
            return config.paths.static.folder + config.paths.static.dist;
        },
        css: function() {
            return config.paths.static.folder + config.paths.static.css;
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
    gulp.src('node_modules/leaflet/dist/**/*').pipe(gulp.dest(config.paths.libs + '/leaflet/dist'));
    gulp.src('node_modules/datatables/**/*').pipe(gulp.dest(config.paths.libs + '/datatables'));
    gulp.src('node_modules/jquery-ui-timepicker-addon/dist/*.css').pipe(gulp.dest(config.paths.libs + '/jquery-ui-timepicker-addon/dist'));
    gulp.src('bower_components/**/*').pipe(gulp.dest(config.paths.libs));
});

gulp.task('build:sass', function () {
    return gulp.src(config.paths.static.folder + config.paths.static.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer({browsers: config.supported_browsers})]))
        .pipe(gulp.dest(config.paths.css()));
});

gulp.task('build:js', function() {
    return gulp.src(config.paths.js())
        .pipe(webpack(webpack_config))
        .pipe(gulp.dest(config.paths.dist()));
});

gulp.task('build', ['build:sass', 'build:js']);

/**
 * Run build on file change
 */
gulp.task('watch', function() {
    gulp.watch([config.paths.sass(), config.paths.js()], ['build']);
});

/**
 * Run test once and exit
 */
gulp.task('unit_tests', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
        logLevel: "info"
    }, done).start();
});

/**
 * Run linter once and exit, tests will fail if there's a warning
 */
gulp.task('lint', function() {
    var tasks = [];
    tasks.push(
        gulp.src(config.paths.static.folder + config.paths.static.js)
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(jshint.reporter('fail'))
    );
    tasks.push(
        gulp.src(config.paths.js_tests)
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(jshint.reporter('fail'))
    );
    return tasks;
});

gulp.task('test', ['unit_tests', 'lint']);

gulp.task('build', ['build:sass', 'build:js']);

/**
 * The default task (called when you run `gulp` from cli)
 */
gulp.task('default', ['watch', 'build']);