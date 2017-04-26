const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const Server = require('karma').Server;
const url_adjuster = require('gulp-css-url-adjuster');
const webpack = require('webpack-stream');
const webpack_config = require('./webpack.config.js');

const config = {
    paths: {
        libs: './django_data_explorer/static/django_data_explorer/libs/',
        static: {
            src_folder: 'frontend_src',
            dist_folder: 'frontend_dist',
            tmp: 'tmp',
            sass: '/sass/**/*.scss',
            css: '/css',
            js: '/js/**/*.js',
            images: '/images/*.*',
        },
        js_tests: 'js_tests/public/*.js',
        sass: () => config.paths.static.src_folder + config.paths.static.sass,
        js: () => config.paths.static.src_folder + config.paths.static.js,
        tmp: () => config.paths.static.tmp,
        django: () => './django_data_explorer/static/django_data_explorer/dist/',
        dist: () => config.paths.static.dist_folder,
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
    gulp.src('node_modules/leaflet/dist/images/*.*').pipe(gulp.dest(config.paths.tmp() + '/images'));
    gulp.src('node_modules/datatables.net-dt/images/*.png').pipe(gulp.dest(config.paths.tmp() + '/images'));
    gulp.src(config.paths.images()).pipe(gulp.dest(config.paths.tmp() + '/images'));
});

gulp.task('build:sass', () => {
    return gulp.src(config.paths.sass())
        .pipe(sass().on('error', sass.logError))
        .pipe(url_adjuster({
            replace: ['../', '']
        }))
        .pipe(postcss([autoprefixer({browsers: config.supported_browsers})]))
        .pipe(gulp.dest(config.paths.tmp()));
});

gulp.task('build:js', () => {
    return gulp.src(config.paths.js())
        .pipe(webpack(webpack_config))
        .pipe(gulp.dest(config.paths.tmp()));
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
    return gulp.src([config.paths.js(), config.paths.js_tests])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('tmp_dist', ['build:js', 'build:sass', 'images']);

gulp.task('django_dist', () => {
    return gulp.src(config.paths.tmp() + '/**/*.*')
        .pipe(gulp.dest(config.paths.django()));
});

gulp.task('npm_dist', () => {
    return [
        gulp.src(config.paths.js())
            .pipe(babel())
            .pipe(gulp.dest(config.paths.dist() + '/js')),
        gulp.src(config.paths.sass())
            .pipe(gulp.dest(config.paths.dist() + '/scss')),
        gulp.src(config.paths.tmp() + '/*.css')
            .pipe(gulp.dest(config.paths.dist())),
        gulp.src(config.paths.tmp() + '/images/*.*')
            .pipe(gulp.dest(config.paths.dist() + '/images')),
    ];
});

gulp.task('clean_dists', () => {
    return del([config.paths.dist(), config.paths.django()]);
});

gulp.task('clean_tmp', () => {
    return del(config.paths.tmp());
});

gulp.task('dist', (callback) => {
    runSequence(
        'tmp_dist',
        ['django_dist', 'npm_dist'],
        'clean_tmp',
        callback
    )
});

gulp.task('build', (callback) =>  {
    runSequence(
        'clean_dists',
        ['lint', 'dist'],
        callback
    );
});

gulp.task('test', ['lint', 'unit_tests']);

/**
 * The default task (called when you run `gulp` from cli)
 */
gulp.task('default', ['watch', 'build']);