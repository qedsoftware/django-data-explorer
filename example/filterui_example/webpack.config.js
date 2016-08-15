const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './example_form.js',
    output: {
        path: __dirname,
        library: 'dqb_example',
        filename: 'example_form.build.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            },
            output: {
                comments: false
            }
        })
    ],
    devtool: 'source-map',
    resolve: {
        modulesDirectories: ["node_modules"],
        alias: {
            modules: path.resolve('../../node_modules')
        }
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: [__dirname],
                loader: 'babel',
                query: {
                    "presets": ["es2015"]
                }
            }
        ]
    }
};