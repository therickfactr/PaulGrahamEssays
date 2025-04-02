const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/api/app.ts',
  target: 'node',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist/api'),
    filename: 'app.js',
    libraryTarget: 'commonjs2',
    sourceMapFilename: '[name].js.map',
    devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                sourceMap: true,
                inlineSourceMap: false,
                sourceRoot: '/',
                mapRoot: '/'
              }
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'null-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util')
    }
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  node: {
    __dirname: false,
    __filename: false
  }
}; 