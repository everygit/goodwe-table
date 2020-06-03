const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');

var outpath = path.resolve(__dirname, '..', 'all.js');
console.log(outpath)

module.exports = {
    entry:outpath,
    output: {
        path: path.resolve(process.cwd()),
        filename:"index.js",
        // library: 'GoodweTable',
        libraryTarget: 'commonjs2'
    },
    mode: 'production',
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
    plugins: [
        new VueLoaderPlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]
}