const typescript = require("@rollup/plugin-typescript");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const babel = require("@rollup/plugin-babel");
const del = require("rollup-plugin-delete");
const less = require("rollup-plugin-less");
const svgr = require("@svgr/rollup");
const json = require("@rollup/plugin-json");
const copy = require("rollup-plugin-copy");
const packageJSON = require("./package.json");

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
    input: "src/App.less",
    plugins: [
      del({ targets: "dist/*" }),
      copy({
        targets: [
          { src: "src/App.less", rename: "main.less", dest: "dist/" },
          {
            src: ["package.json", "LICENSE"],
            dest: "dist/",
          },
        ],
      }),
      less({
        output: "dist/main.css",
        option: {
          javascriptEnabled: true,
        },
      }),
    ],
  },
  {
    input: ["src/index.ts", "src/components/index.ts", "src/models/index.ts"],
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
      typescript(),
      resolve(),
      commonjs(),
      json(),
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
