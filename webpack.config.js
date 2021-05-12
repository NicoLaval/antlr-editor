const path = require("path");
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
    externals: {
        'react': 'react', // Case matters here 
        'react-dom' : 'reactDOM' // Case matters here 
    },
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
            type: "module",
        }
    },
};
