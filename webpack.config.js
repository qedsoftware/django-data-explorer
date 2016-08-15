const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: ['babel-polyfill', './frontend_src/js/app.js'],
    output: {
        path: path.resolve('./frontend_src/dist'),
        library: 'django_querybuilder',
        libraryTarget: 'umd',
        filename: 'querybuilder.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
            "window.jQuery": "jquery",
            "window.$": "jquery"
        }),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("./bower.json", ["main"])
        ),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        })
    ],
    devtool: 'source-map',
    resolve: {
        modulesDirectories: ["node_modules", "bower_components"],
        alias: {
            // bind version of jquery-ui
            "jquery-ui": path.join(__dirname, "node_modules/jquery-ui/jquery-ui.js"),
            "jquery.ui": path.join(__dirname, "node_modules/jquery-ui/jquery-ui.js"),
            // bind to modules;
            modules: path.join(__dirname, "node_modules")
        }
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: [
                    path.join(__dirname, './frontend_src/js'),
                    path.join(__dirname, 'js_tests/')
                ],
                loader: 'babel',
                query: {
                    "presets": ["es2015"]
                }
            }
        ]
    },
    stats: {
        colors: true
    }
};