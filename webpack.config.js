const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const webpack = require('webpack');

module.exports = {
    entry: {
        bundle: './src/index.jsx',
        vendor: ['react', 'react-dom', 'babel-polyfill', 'smoothscroll-polyfill'],
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].[hash].js',
    },
    devServer: {
        compress: true,
        host: '0.0.0.0',
        port: 3000,
        historyApiFallback: true,
        hot: true,
        stats: {
            colors: true,
            hash: false,
            version: false,
            timings: false,
            assets: true,
            chunks: false,
            modules: false,
            reasons: false,
            children: false,
            source: false,
            errors: true,
            errorDetails: true,
            warnings: true,
            publicPath: true
        }
    },
    devtool: 'source-map',
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                use: {loader: 'babel-loader',},
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
            },
            {
                test: /\.(scss|css)$/,
                use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader'],
                })),
            },
            {
                test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
                use: 'url-loader',
            },
        ],
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en|ru|ua)$/),
        //new BundleAnalyzerPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('styles.css',),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
        }),
        // new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new CopyWebpackPlugin([{
            from: './src/assets',
            to: './assets',
        }]),
        new webpack.ProvidePlugin({
            SmoothScroll: 'smoothscroll-polyfill',
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
        }),
    ],
};
