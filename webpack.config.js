const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'src/js/app.js'),
  output: {
    filename: 'app.js',
    path: path.join(__dirname, 'public/javascripts')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: 'vue-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  }
}
