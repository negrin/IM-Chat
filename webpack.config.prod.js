const webpack = require('webpack');
const config = require('./webpack.config.base');

config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin(
        /* chunkName: */ 'vendor',
        /* filename: */ 'vendor.[hash].js'
    ),

    new webpack.optimize.DedupePlugin(),

    new webpack.optimize.UglifyJsPlugin(
        {
            minimize: true,
            compress: {
                warnings: false
            },
            sourceMap: false
        }
    )
);

config.eslint = {
    configFile: '.eslintrc'
};

module.exports = config;