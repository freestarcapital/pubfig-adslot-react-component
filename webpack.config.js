const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require("webpack");
const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || 0
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'production',
  entry: './src/components/FreestarAdSlot/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'index.js',
    libraryTarget: "commonjs2"
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
      }
    ],
  },
  resolve: {
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'prop-types' : path.resolve(__dirname, './node_modules/prop-types'),
    }
  },
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
        __PACKAGE_VERSION__: '"' + version + '"'
    })
  ]
};
