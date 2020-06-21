const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    'canvas': path.resolve(__dirname, 'src', 'canvas', 'index.js'),
    'css3': path.resolve(__dirname, 'src', 'css3', 'index.js'),
    'index': path.resolve(__dirname, 'src', 'index.js'),
  },
  output: {
    path: path.resolve(__dirname),
    filename: '[name].bundle.js'
  },
  devServer: {
    port: 9527,
    host: 'localhost',
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src', 'index.html'),
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      filename: 'canvas.html',
      template: path.resolve(__dirname, 'src', 'canvas','index.html'),
      chunks: ['canvas']
    }),
    new HtmlWebpackPlugin({
      filename: 'css3.html',
      template: path.resolve(__dirname, 'src', 'css3', 'index.html'),
      chunks: ['css3']
    })
  ]
}