/* eslint-disable */
/* vue build 项目配置 */
const fs = require('fs');
const ora = require('ora');
const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('./plugins/extract-text-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpackConfig = require('./config');

const dist = path.join(__dirname, '../dist/');

webpackConfig.devtool = false;

webpackConfig.module.rules.push({
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        use: ['css-loader', 'postcss-loader'],
    }),
});
// webpackConfig.entry = {
//     m: path.join(__dirname, '../src/js/entry.js'),
// };
webpackConfig.output= {
    path: dist,
    filename: 'static/[name].[chunkhash:7].js',
    chunkFilename: 'static/[name].[chunkhash:7].js',
    publicPath: './',
};

webpackConfig.plugins.push(
    new ExtractTextPlugin({
        filename: 'static/css/index.[contenthash:6].css',
        allChunks: false
    }),
    new webpack.HashedModuleIdsPlugin(),
    new CleanPlugin(['dist'], {
        root: path.join(__dirname, '../'),
        verbose: true,
        dry: false,
    }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: "production",
        },
    }),
    // 将公共模块打包到公共文件 vendor 中
    // minChunks的值决定有多少个entry文件调用了相同模块，才打包进公共文件中
    new webpack.optimize.CommonsChunkPlugin({
        names: ['common'],
        minChunks: Infinity
    }),
    // 提取 webpack runtime 和 module manifest 到独立的文件，以避免在 bundle 更新后 vendor hash 被更新
    new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        filename: 'static/manifest.[hash:7].js',
    })
);
if (process.env.npm_config_mini) {
    webpackConfig.plugins.push(
        // 压缩 css
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
        // 压缩 js
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false,
                    drop_console: true,
                    drop_debugger: true,
                },
            },
            sourceMap: false,
            parallel: true
        }),
    );
}

if (process.env.npm_config_analyze) {
    webpackConfig.plugins.push(
        new BundleAnalyzerPlugin()
    )
}

webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
        filename: '../dist/index.html',
        template: path.join(__dirname, '../src/index.html'),
        chunks: ['m','manifest','common'],
        inject: true, // 允许插件修改哪些内容，包括head与body
        // hash: true, // 为静态资源生成hash值，可以实现缓存
        minify: {
            removeComments: true, // 移除HTML中的注释
            collapseWhitespace: true,
            removeEmptyAttributes: true,
        },
        chunksSortMode: 'dependency',
    }),
);

const spinner = ora('正在打包...');
spinner.start();

webpack(webpackConfig, (err, stats) => {
    setTimeout(() => {
        spinner.stop();
    }, 2000);

    if (err) throw err;

    process.stdout.write(`${stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
    })}\n\n`);

    console.log('  打包完成~\n');

    console.log('  提示:\n' +
        '  打包后的文件必须经过 HTTP 服务器访问.\n' +
        '  直接通过 file:// 方式打开无效.\n');
});
