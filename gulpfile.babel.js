const gulp = require('gulp');
const Server = require('karma').Server;
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const url_adjuster = require('gulp-css-url-adjuster');
const webpack = require('webpack-stream');
const webpack_config = require('./webpack.config.js');
const eslint = require('gulp-eslint');

const config = {
    paths: {
        libs: './django_data_explorer/static/django_data_explorer/libs/',
        static: {
            src_folder: 'frontend_src',
            dist_folder: 'frontend_dist',
            sass: '/sass/**/*.scss',
            css: '/css',
            js: '/js/**/*.js',
            images: '/images/*.*'
        },
        js_tests: 'js_tests/public/*.js',
        sass: () => config.paths.static.src_folder + config.paths.static.sass,
        js: () => config.paths.static.src_folder + config.paths.static.js,
        dist: () => config.paths.static.dist_folder,
        css: () => config.paths.static.dist_folder,
        django: () => './django_data_explorer/static/django_data_explorer/dist/',
        images: () => config.paths.static.src_folder + config.paths.static.images,
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

gulp.task('images', () => {
    gulp.src('node_modules/leaflet/dist/images/*.*').pipe(gulp.dest(config.paths.dist() + '/images'));
    gulp.src('node_modules/datatables.net-dt/images/*.png').pipe(gulp.dest(config.paths.dist() + '/images'));
    gulp.src(config.paths.images()).pipe(gulp.dest(config.paths.dist() + '/images'));
});

gulp.task('build:sass', () => {
    return gulp.src(config.paths.sass())
        .pipe(sass().on('error', sass.logError))
        .pipe(url_adjuster({
            replace: ['../', '']
        }))
        .pipe(postcss([autoprefixer({browsers: config.supported_browsers})]))
        .pipe(gulp.dest(config.paths.css()));
});

gulp.task('build:js', () => {
    return gulp.src(config.paths.js())
        .pipe(webpack(webpack_config))
        .pipe(gulp.dest(config.paths.dist()));
});

/**
 * Run build on file change
 */
gulp.task('watch', () => {
    gulp.watch([config.paths.sass(), config.paths.js()], ['build']);
});

/**
 * Run test once and exit
 */
gulp.task('unit_tests', (done) => {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
        logLevel: "info"
    }, done).start();
});

/**
 * Run linter once and exit, tests will fail if there's a warning
 */
gulp.task('lint', () => {
    const tasks = [];
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

gulp.task('copy_dist', ['build:js', 'build:sass', 'images'], () => {
    return gulp.src(config.paths.dist() + '/**/*.*')
        .pipe(gulp.dest(config.paths.django()));
});

gulp.task('test', ['lint', 'unit_tests']);

gulp.task('build', ['lint', 'copy_dist']);

/**
 * The default task (called when you run `gulp` from cli)
 */
gulp.task('default', ['watch', 'build']);