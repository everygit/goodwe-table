const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    entry:'./example/index.js',
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    devtool:'source-map',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test:/\.css$/,
                loader:['style-loader', 'css-loader']
            },
            {
                test:/\.s[ac]ss$/,
                loader: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins:[new HtmlWebpackPlugin({
        title:"测试",
        template: 'index.html'
    }), new VueLoaderPlugin()]
}