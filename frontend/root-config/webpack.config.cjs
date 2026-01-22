const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = (webpackConfigEnv = {}, argv) => {
    const orgName = "gamehub";
    const isProduction = argv.mode === "production";

    return {
        entry: path.resolve(__dirname, "src/gamehub-root-config.ts"),
        output: {
            filename: `${orgName}-root-config.js`,
            path: path.resolve(__dirname, "dist"),
            libraryTarget: "system",
            publicPath: "",
            clean: true,
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        externals: ["single-spa"],
        plugins: [
            new HtmlWebpackPlugin({
                inject: false,
                template: "src/index.ejs",
                templateParameters: {
                    isLocal: webpackConfigEnv.isLocal || false,
                    orgName,
                },
            }),
        ],
        devServer: {
            historyApiFallback: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            allowedHosts: "all",
            port: 9000,
        },
        devtool: isProduction ? "source-map" : "eval-source-map",
    };
};
