const path = require("path");

const babelLoader = {
    loader: 'babel-loader',
    options: {
        presets: [
            "@babel/preset-env"
        ],
        plugins: [
            "@babel/plugin-transform-classes"
        ]
    }
};
let pathRegex = /node_modules\/(?!(marktex.js)\/).*/;
module.exports = {
    mode: "development",
    entry: "./src/index.es5.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "marktex.es5.js",
        library: "marktex",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [babelLoader, "ts-loader"],

                exclude: [pathRegex ]
            },
            {
                test: /\.js$/,
                use: [babelLoader],

                exclude: [pathRegex]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },

    // devtool: "inline-source-map"
};