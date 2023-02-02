const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const packageJson = require("./package.json");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

/** @type {import("webpack").Configuration} */
const getConfig = async () => ({
  mode: "production",
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
  externals: Object.keys(packageJson.peerDependencies),
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
    extensions: [".tsx", ".ts", ".jsx", ".js", ".mjs"],
  },
  optimization: {
    minimize: true,
  },
  devtool: false,
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
