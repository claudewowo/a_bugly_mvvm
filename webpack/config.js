const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
    entry: {
        m: path.join(__dirname, '../src/js/entry.js'),
        common: [
            path.join(__dirname, '../src/js/polyfill/polyfills.js'),
        ]
    },
    resolve: {
        extensions: ['.css', '.js', '.vue', '.json'],
        modules: [
            path.resolve(__dirname, '../src'),
            path.resolve(__dirname, '../node_modules'),
        ],
        // 路径别名
        alias: {
            src: path.resolve(__dirname, '../src'),
            css: path.resolve(__dirname, '../src/css'),
            img: path.resolve(__dirname, '../src/img'),
            js: path.resolve(__dirname, '../src/js'),
            comp: path.resolve(__dirname, '../src/components'),
        },
    },
    module: {
        rules: [{
            test: /\.js$/,
            enforce: 'pre',
            use: ['babel-loader'],
            exclude: [
                path.resolve(__dirname, '../node_modules'),
            ],
        }, {
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 2048,
                    name: '[name].[ext]',
                    outputPath: 'static/img/',
                    publicPath: '/static/img/', // 打包后css中文件的路径: './img/[name].[ext]'
                },
            },
            exclude: [
                path.resolve(__dirname, '../node_modules'),
            ],
        },
        {
            test: /\.art$/,
            use: [{
                loader: 'art-template-loader',
                options: {
                    minimize: true,
                }
            }]
        }],
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
    ],
    performance: {
        hints: false, // 性能(Performance)配置 false | "error" | "warning"
        maxAssetSize: 5000000,
        maxEntrypointSize: 10000000,
    },
};
