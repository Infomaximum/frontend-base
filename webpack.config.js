// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const packageJson = require("./package.json");
const webpack = require("webpack");
const AutoExport = require("webpack-auto-export");
const fs = require("fs/promises");

const isProduction = process.env.NODE_ENV == "production";

const deepReadDir = async (dirPath, arr) =>
  await Promise.all(
    (
      await fs.readdir(dirPath, { withFileTypes: true })
    ).map(async (dirent) => {
      const _path = path.join(dirPath, dirent.name);

      return dirent.isDirectory()
        ? (arr.push(_path), await deepReadDir(_path, arr))
        : _path;
    })
  );

const getEntities = async (ent) => {
  const result = [];

  await deepReadDir(path.resolve(__dirname, "src", ent), result);

  return [
    ent,
    ...result.flat(Number.POSITIVE_INFINITY).map((p) => {
      return path.relative(path.resolve(__dirname, "src"), p);
    }),
  ];
};

/** @type {import("webpack").Configuration} */
const getConfig = async () => ({
  entry: ["./src/App.less", "./src/index.ts"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: { name: packageJson.name, type: "umd" },
    globalObject: "this",
    clean: true,
  },
  plugins: [
    new webpack.ProgressPlugin(),
    // new AutoExport({
    //   extension: ".ts", // define extension of generated index file
    //   exportType: "detect", // the default way to export. values can be: 'named' | 'default' | 'detect'
    //   baseDir: "./src", // base directory to observe the changes
    //   paths: [
    //     { path: ".", ignore: /App|svg|global|resources/ },
    //     ...(await getEntities("")),
    //     // ...(await getEntities("components")),
    //     // ...(await getEntities("utils")),
    //     // ...(await getEntities("managers")),
    //     // ...(await getEntities("decorators")),
    //     // ...(await getEntities("models")),
    //     // ...(await getEntities("styles")),
    //   ],
    // }),

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

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
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
