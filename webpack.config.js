const webpack = require('webpack');
module.exports = {
  entry: {
    main: './src'
  },
  output: {
    path: 'builds',
    filename: 'bundle.js',
    publicPath: 'builds/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: __dirname + '/src'
      },
      {
        test: /\.sass/,
        loader: 'style!css!sass'
      },
      {
        test: /\.html/,
        loader: 'html'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'main',
      children: true,
      minChunks: 2
    })
  ]
}
