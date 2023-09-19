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
            title: 'My App',
            filename: './index.html',
            template: './index.html'
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
        path: path.resolve(__dirname),
    },



}
