/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const glob = require("glob");

function fixImports(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const packageName = require("../package.json").name;

  const fixed = content.replace(
    new RegExp(`from ["']${packageName}/src/([^"']+)["']`, "g"),
    (match, importPath) => {
      const relativePath = path.relative(
        path.dirname(filePath.replace("dist/", "src/")),
        path.join("src", importPath)
      );

      return `from "${relativePath.startsWith(".") ? relativePath : `./${relativePath}`}"`;
    }
  );

  if (fixed !== content) {
    fs.writeFileSync(filePath, fixed);
  }
}

glob.sync("dist/**/*.d.ts").forEach(fixImports);
