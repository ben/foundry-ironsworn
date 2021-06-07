/* eslint-disable */
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const path = require("path");
const glob = require("glob");

const allTemplates = () => {
    return glob
        .sync("**/*.hbs", { cwd: path.join(__dirname, "templates") })
        .map((file) => `"templates/${file}"`)
        .join(", ");
};

module.exports = (env) => {
    const defaults = {
        watch: false,
        mode: "development",
    };

    const environment = { ...defaults, ...env };
    const isDevelopment = environment.mode === "development";

    const config = {
        entry: "./src/index.ts",
        watch: environment.watch,
        devtool: "inline-source-map",
        mode: environment.mode,
        resolve: {
            extensions: [".wasm", ".mjs", ".ts", ".js", ".json"],
        },
        output: {
            filename: "ironsworn.js",
            path: path.resolve(__dirname, "dist"),
            publicPath: "/systems/foundry-ironsworn/",
        },
        devServer: {
            hot: true,
            writeToDisk: true,
            proxy: [{
                context: (pathname) => {
                    return !pathname.match("^/sockjs");
                },
                target: "http://localhost:30000",
                ws: true,
            }],
        },
        module: {
            rules: [
                isDevelopment
                    ? {
                          test: /\.hbs$/,
                          loader: "raw-loader",
                      }
                    : {
                          test: /\.hbs$/,
                          loader: "null-loader",
                      },
                {
                    test: /\.ts$/,
                    use: ["ts-loader", "webpack-import-glob-loader", "source-map-loader"],
                },
                {
                    test: /TemplatePreloader\.ts$/,
                    use: [
                        {
                            loader: "string-replace-loader",
                            options: {
                                search: '"__ALL_TEMPLATES__"',
                                replace: allTemplates,
                            },
                        },
                    ],
                },
                {
                    test: /\.less$/,
                    use: [
                        "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: isDevelopment,
                                url: false,
                            },
                        },
                        {
                            loader: "postcss-loader",
                        },
                        {
                            loader: "less-loader",
                            options: {
                                sourceMap: isDevelopment,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new ESLintPlugin({
                extensions: ["ts"],
            }),
            new CopyPlugin({
                patterns: [{ from: "system" }],
            }),
        ],
    };

    if (!isDevelopment) {
        delete config.devtool;
    }

    return config;
};
