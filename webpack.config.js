const path = require('path');

module.exports = {
    entry: path.join(__dirname, '/js/HexGrid.ts'),
    output: {
        filename: 'HexGrid.js',
        library: 'HexGrid',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
};