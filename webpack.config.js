const webpack = require('webpack');
const production = process.env.NODE_ENV === 'production';
const CleanPlugin = require('clean-webpack-plugin');
const ExtractPlugin = require('extract-text-webpack-plugin');

let plugins = [
  // new ExtractPlugin('bundle.css', { allChunks: true }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'main',
    children: true,
    minChunks: 2
  })
];

if (production) {
  plugins = plugins.concat([
    // 同名のchunkとfileをマージする
    new webpack.optimize.DedupePlugin(),
    // chunkとmoduleの使用頻度によって最適化
    new webpack.optimize.OccurenceOrderPlugin(),
    // chunkサイズが小さくなることによる読み込み効率悪化の防止
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 51200
    }),
    // bundleの全てのjsコードをminify
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false
      }
    }),
    // productionで設定できる様々な変数を定義
    new webpack.DefinePlugin({
      __SERVER__: !production,
      __DEVELOPMENT__: !production,
      __DEVTOOLS__: !production,
      'process.env': {
        BABEL_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new CleanPlugin('builds')
  ]);
}
module.exports = {
  debug: !production,
  devtool: production ? false : 'eval',
  entry: {
    main: './src'
  },
  output: {
    path: 'builds',
    filename: production ? '[name]-[hash].js' : 'bundle.js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'builds/'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint'
      },
      {
        test: /\.js$/,
        loader: 'baggage?[file].html=template&[file].sass'
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: __dirname + '/src'
      },
      {
        test: /\.sass/,
        // loader: ExtractPlugin.extract('style', 'css!sass')
        loader: 'style!css!sass'
      },
      {
        test: /\.html/,
        loader: 'html'
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/i,
        loader: 'url?limit=10000'
      }
    ]
  },
  plugins: plugins
}
