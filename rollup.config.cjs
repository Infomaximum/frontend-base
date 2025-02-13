/* eslint-disable @typescript-eslint/no-var-requires */
const packageJSON = require("./package.json");
const typescript = require("@rollup/plugin-typescript");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const babel = require("@rollup/plugin-babel");
const del = require("rollup-plugin-delete");
const svgr = require("@svgr/rollup");
const json = require("@rollup/plugin-json");
const { svgURLPlugin } = require("./configs/rollup/svgURLPlugin");

const externalPackages = [
  ...Object.keys(packageJSON.dependencies || {}),
  ...Object.keys(packageJSON.peerDependencies || {}),
];

const regexesOfPackages = externalPackages.map(
  (packageName) => new RegExp(`^${packageName}(\/.*)?`)
);

/**
 * @type {import("rollup").RollupOptions[]}
 */
const config = [
  {
    input: [
      "src/index.ts",
      "src/libs/core/index.ts",
      "src/libs/utils/index.ts",
      "src/components/index.ts",
      "src/models/index.ts",
      "src/store/index.ts",
      "src/layouts/index.ts",
    ],
    output: {
      dir: "dist",
      format: "es",
      sourcemap: true,
      entryFileNames: (w) => {
        if (w?.name?.includes?.("node_modules/")) {
          return w.name.replace("node_modules/", "external/") + ".js";
        }

        return "[name].js";
      },
      preserveModules: true,
      preserveModulesRoot: "src",
    },

    plugins: [
      del({ targets: "dist/*" }),
      typescript(),
      resolve(),
      commonjs(),
      json(),
      svgURLPlugin(),
      svgr({
        svgoConfig: {
          plugins: [
            {
              name: "removeViewBox",
              active: false,
            },
          ],
        },
      }),
      babel({
        exclude: "node_modules/**",
        extensions: [".js", ".ts", ".jsx", ".tsx"],
        babelHelpers: "bundled",
      }),
    ],
    external: regexesOfPackages,
  },
];

module.exports = config;
