const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const packageJson = require("./package.json");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

/** @type {import("webpack").Configuration} */
const getConfig = async () => ({
  entry: ["./src/App.less", "./src/index.ts"],
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "index.js",
    library: { name: packageJson.name, type: "umd" },
    globalObject: "this",
    clean: true,
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "App.less"),
          to: path.resolve(__dirname, "dist", "main.less"),
        },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: "main.css",
    }),
  ],
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom",
    },
    "react-router": {
      root: "ReactRouter",
      commonjs2: "react-router",
      commonjs: "react-router",
      amd: "react-router",
    },
    "react-router-dom": {
      root: "ReactRouterDom",
      commonjs2: "react-router-dom",
      commonjs: "react-router-dom",
      amd: "react-router-dom",
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(ts|tsx)$/i,
        exclude: ["/node_modules/"],
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
            options: {
              onlyCompileBundledFiles: true,
            },
          },
        ],
      },
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.(eot|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  resolve: {
    alias: {
      [packageJson.name]: path.resolve(__dirname, "src/"),

      [`${packageJson.name}/components`]: path.resolve(
        __dirname,
        "src/components"
      ),
      [`${packageJson.name}/utils`]: path.resolve(__dirname, "src/utils"),
    },
    extensions: [".tsx", ".ts", ".jsx", ".js", ".mjs"],
    plugins: [],
  },
  devtool: "source-map",
});

module.exports = async () => {
  const config = await getConfig();

  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }

  return config;
};
