var webpack = require('webpack');
var path = require('path');
var util = require('util');
var config;

function createWebpackConfig(options) {
    var config = {};
    var plugins;
    var publicPath;
    var entry;
    var entryFile = './main.js';

    options = options || {};

    if (!options.build) {
        publicPath = ['http://localhost:8888/'].join('');
        entry = {
            app: [
                'webpack-dev-server/client?' + publicPath,
                'webpack/hot/only-dev-server',
                entryFile
            ],
        };
        plugins = [
            new webpack.NoErrorsPlugin()
        ];
        config.devtool = 'cheap-module-eval-source-map';
        config.debug = true;
        config.watch = true;
    } else {
        entry = {
            app: [
                entryFile
            ]
        };
        plugins = [
            new webpack.optimize.DedupePlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            }),
            new webpack.optimize.UglifyJsPlugin()
        ];
        config.devtool = 'source-map';
    }

    util._extend(config, {
        node: {
            fs: 'empty'
        },
        resolve: {
            root: path.resolve(__dirname)
        },
        entry: entry,
        output: {
            filename: 'app.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: publicPath
        },
        module: {
            loaders: [
                {
                    test: /\.js?$/,
                    exclude: /node_modules/,
                    loader: 'babel'
                }
            ]
        },
        plugins: plugins
    });

    return config;
}

if (process.argv.indexOf('--build') > -1) {
    config = createWebpackConfig({ build: true });
} else {
    config = createWebpackConfig({});
}

module.exports = config;
