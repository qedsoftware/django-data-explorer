'use strict';

var gulp = require('gulp');
var Server = require('karma').Server;
var bower = require('gulp-bower');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var url_adjuster = require('gulp-css-url-adjuster');
var webpack = require('webpack-stream');
var webpack_config = require('./webpack.config.js');
var eslint = require('gulp-eslint');

var config = {
    paths: {
        libs: './django_querybuilder/static/django_querybuilder/libs/',
        static: {
            src_folder: 'frontend_src',
            dist_folder: 'frontend_dist',
            sass: '/sass/**/*.scss',
            css: '/css',
            js: '/js/**/*.js',
            images: '/images/*.*'
        },
        js_tests: 'js_tests/public/*.js',
        sass: function() {
            return config.paths.static.src_folder + config.paths.static.sass;
        },
        js: function() {
            return config.paths.static.src_folder + config.paths.static.js;
        },
        dist: function() {
            return config.paths.static.dist_folder;
        },
        css: function() {
            return config.paths.static.dist_folder;
        },
        django: function() {
            return './django_querybuilder/static/django_querybuilder/dist/';
        },
        images: function() {
            return config.paths.static.src_folder + config.paths.static.images;
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

gulp.task('bower', function() {
    return bower();
});

gulp.task('images', function() {
    gulp.src('node_modules/leaflet/dist/images/*.*').pipe(gulp.dest(config.paths.dist() + '/images'));
    gulp.src('node_modules/datatables/media/images/*.png').pipe(gulp.dest(config.paths.dist() + '/images'));
    gulp.src(config.paths.images()).pipe(gulp.dest(config.paths.dist() + '/images'));
});

gulp.task('build:sass', function () {
    return gulp.src(config.paths.sass())
        .pipe(sass().on('error', sass.logError))
        .pipe(url_adjuster({
            replace: ['../', '']
        }))
        .pipe(postcss([autoprefixer({browsers: config.supported_browsers})]))
        .pipe(gulp.dest(config.paths.css()));
});

gulp.task('build:js', function() {
    return gulp.src(config.paths.js())
        .pipe(webpack(webpack_config))
        .pipe(gulp.dest(config.paths.dist()));
});

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
        gulp.src(config.paths.js())
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError())
    );
    tasks.push(
        gulp.src(config.paths.js_tests)
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError())
    );
    return tasks;
});

gulp.task('copy_dist', ['build:js', 'build:sass', 'images'], function() {
    return gulp.src(config.paths.dist() + '/**/*.*')
        .pipe(gulp.dest(config.paths.django()));
});

gulp.task('test', ['lint', 'unit_tests']);

gulp.task('build', ['lint', 'copy_dist']);

/**
 * The default task (called when you run `gulp` from cli)
 */
gulp.task('default', ['watch', 'build']);