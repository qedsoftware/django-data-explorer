var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var path = require('path');

webpackConfig.entry = {};

webpackConfig.module.preLoaders =  [
  {
    test: /\.js$/,
    include: path.join(__dirname, 'django_querybuilder/static/django_querybuilder/js'),
    loader: 'istanbul-instrumenter'
  }
];

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['wiredep', 'qunit'],

    client: {
      qunit: {
        testTimeout: 30000
      }
    },


    // bower dependencies
    // https://github.com/lbragaglia/karma-wiredep
    wiredep: {
      dependencies: true,
      devDependencies: false
    },


    // list of files / patterns to load in the browser
    files: [
      'js_tests/test_index.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'django_querybuilder/static/django_querybuilder/js/*.js': ['webpack', 'coverage'],
      'js_tests/*.js': ['webpack']
    },


	webpack: webpackConfig,


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],


    coverageReporter: {
      check: {
        global: {
          statements: 50,
          branches: 50,
          functions: 50,
          lines: 50,
          excludes: []
        },
        each: {
          statements: 10,
          branches: 10,
          functions: 10,
          lines: 10,
          excludes: []
        }
      },
      reporters: [
        {type : 'html', dir : 'js_tests/coverage/'},
        {type : 'text'}
      ]
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],
    browserNoActivityTimeout: 60000,


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,


    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1
  })
};
