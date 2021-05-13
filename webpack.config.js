const path = require("path");
const nodeExternals = require("webpack-node-externals");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "production",
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.ttf$/,
                use: ["file-loader"],
            },
        ],
    },
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    externals: ["react", ...nodeExternals()],
    // externals: {
    //     "antlr4ts": "antlr4ts",
    //     "monaco-editor": "monaco-editor",
    //     "react": "react",
    //     "react-monaco-editor": "^react-monaco-editor",
    // },
    plugins: [new MonacoWebpackPlugin()],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
        library: {
            type: "commonjs2",
        },
    },
};
