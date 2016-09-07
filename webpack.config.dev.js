const webpack = require('webpack');
const config = require('./webpack.config.base');

config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin(
        /* chunkName: */ 'vendor',
        /* filename: */ 'vendor.[hash].js'
    )
);

config.eslint = {
    configFile: '.eslintrc.dev'
};

module.exports = config;
