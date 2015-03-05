var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    './src/index.js',
    'webpack/hot/only-dev-server',
    'webpack-dev-server/client?http://localhost:8080'
  ],
  output: {
    path: __dirname + '/build/',
    publicPath: '/build/',
    filename: 'component.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['','.js']
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
      { test: /\.styl$/, loaders: ['style', 'css', 'stylus'], exclude: /node_modules/ },
      { test: /\.(ttf|eot|svg|woff)/, loaders: ['url?limit=100000'] },
      { test: /\.png/, loaders: ['url?limit=100000'] }
    ]
  }
};