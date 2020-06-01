const path = require('path'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  VueLoaderPlugin = require('vue-loader/lib/plugin');

//Resolve path to an absolute path
var inProduction = process.env.NODE_ENV === 'production';
var mode = 'development';
var isDevMode = false;

//Check if the code is in production
if (inProduction) {
  mode = 'production';
  isDevMode = true;
}

module.exports = {
  mode,
  entry: {
    polyfill: '@babel/polyfill',
    main: path.resolve(__dirname, 'src', 'main'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': isDevMode
        ? 'vue/dist/vue.runtime.js'
        : 'vue/dist/vue.runtime.min.js',
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: [
          isDevMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          {loader: 'css-loader', options: {sourceMap: isDevMode}},
        ],
      },
      {enforce: 'pre', test: /\.js$/, loader: 'source-map-loader'},
      {
        test: /\.(woff2?|ttf|otf|eot|svg)$/,

        exclude: /node_modules/,

        loader: 'file-loader',

        options: {
          name: '[name].[ext]',

          outputPath: 'assets/fonts/',
        },
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        exclude: /node_modules/,

        loader: 'file-loader',

        options: {
          name: '[name].[ext]',

          outputPath: 'assets/images/',
        },
      },
    ],
  },
  devServer: {
    contentBase: './build',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      favicon: './public/favicon.ico',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new VueLoaderPlugin(),
  ],
};
