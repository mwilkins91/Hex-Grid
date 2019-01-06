const path = require('path');
const babelOptions = {
  "presets": []
};
module.exports = {
    entry: path.join(__dirname, '/js/index.ts'),
    output: {
        filename: 'HexGrid.js',
        library: 'HexGrid',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [
          {
            test: /\.ts(x?)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
                options: babelOptions
              },
              {
                loader: 'ts-loader'
              }
            ]
          },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: []
};