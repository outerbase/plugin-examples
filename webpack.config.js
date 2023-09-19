const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
    mode: 'production',
    entry: './index.js',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            scriptLoading: 'blocking',
            inject: 'head'
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname),
        },
        compress: true,
        port: 8080,
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
    },



}
