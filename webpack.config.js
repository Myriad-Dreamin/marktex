const path = require("path");

module.exports = {
    mode: "development",
    entry: "./node_modules/marktex.js/dist",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "marktex.js",
        library: "marktex",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ["babel-loader", "ts-loader"],
                exclude: [path.resolve(__dirname, "node_modules")]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    }
    // devtool: "inline-source-map"
};