const path = require('path');

const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'app');

module.exports = {
  devtool: 'eval-source-map',

  entry:  __dirname + "/app/main.jsx",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  },

  module: {
    preLoaders: [
    //{ test: /\.js(x)?$/, loader: 'eslint-loader', exclude: /node_modules|public\/javascripts/ }
    ],

    loaders: [
    { test: /\.json$/, loader: "json" },
    { test: /\.js(x)?$/, exclude: /node_modules/, loader: 'babel', query: { presets: ['es2015','react'] } },
    { test: /\.css$/, loader: 'style!css' },
    { test: /\.less$/, loader: "style!css!less" },
    { test: /\.(woff(2)?|svg|eot|ttf|gif|jpg)(\?.+)?$/, loader: 'file-loader' },
    { test: /\.png$/, loader: 'url-loader' },

    ]
  },
  resolve: {
    // you can now require('file') instead of require('file.coffee')
    extensions: ['', '.js', '.json', '.jsx', '.ts'],
    modulesDirectories: [APP_PATH, 'node_modules', path.resolve(ROOT_PATH, 'public')],
  },


  devServer: {
    contentBase: "./public",
    colors: true,
    historyApiFallback: true,
    inline: true
  },
}
