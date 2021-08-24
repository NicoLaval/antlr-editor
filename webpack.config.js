const path = require("path");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const ASSET_PATH = process.env.ASSET_PATH || "/";

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
    externals: {
        "antlr4ts": "antlr4ts",
        "monaco-editor": "monaco-editor",
        "react": "react",
        "react-dom": "react-dom",
        "react-monaco-editor": "react-monaco-editor",
    },
    plugins: [new MonacoWebpackPlugin({ publicPath: "/" })],
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
        publicPath: ASSET_PATH,
        library: {
            type: "commonjs2",
        },
    },
};
