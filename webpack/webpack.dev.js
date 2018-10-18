const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowser = require('open-browser-webpack-plugin');
const webpackConfig = require('./config');

const port = 8081;

webpackConfig.module.rules.push({
    test: /\.css$/,
    exclude: /node_modules/,
    use: ['style-loader', {
        loader: 'css-loader',
        options: {
            importLoaders: 1,
        },
    }, 'postcss-loader'],
});

webpackConfig.output = {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: './',
};

webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.join(__dirname, '../src/index.html'),
        inject: true,
        chunks: ['m'],
        minify: {
            removeComments: true, // 移除HTML中的注释
            removeEmptyAttributes: true,
        },
        chunksSortMode: 'dependency',
    }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('development'),
        },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new OpenBrowser({ url: `http://localhost:${port}` }),
);

module.exports = {
    entry: webpackConfig.entry,
    output: webpackConfig.output,
    // 解析模块
    resolve: webpackConfig.resolve,
    module: webpackConfig.module,

    plugins: webpackConfig.plugins,
    devtool: 'eval-source-map',
    devServer: {
        hot: true,
        inline: true,
        compress: false,
        contentBase: path.join(__dirname, '../dist'),
        historyApiFallback: false,
        publicPath: '/',
        overlay: true,
        quiet: true,
        proxy: {
            '/api': {
                target: 'http://xx.xx.xx.xx:8000',
                pathRewrite: { '^/api': '' },
            },
        },
        host: '0.0.0.0',
        port,
    },
};
