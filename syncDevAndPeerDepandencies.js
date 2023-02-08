const path = require("path");
const semver = require("semver");
const packageJSON = require(path.resolve(process.cwd(), "package.json"));

const peerDependencies = packageJSON.peerDependencies;
const devDependencies = packageJSON.devDependencies;
const dependencies = packageJSON.dependencies;

Object.keys(peerDependencies).forEach((libName) => {
  const libVersion = peerDependencies[libName];

  const libVersionDevDependencies = devDependencies[libName];
  const libVersionDependencies = dependencies[libName];

  if (!libVersionDevDependencies && !libVersionDependencies) {
    console.error(`Библиотеки ${libName} нет в devDependencies и dependencies`);
    process.exit(1);
  } else if (
    libName in devDependencies &&
    !semver.intersects(libVersion, libVersionDevDependencies)
  ) {
    console.error(
      `Библиотека ${libName} с версией ${libVersion} в peerDependencies,` +
        `отличается от версии ${libVersionDevDependencies} в devDependencies,` +
        `синхронизируйте версии!`
    );
    process.exit(1);
  } else if (
    libName in dependencies &&
    !semver.intersects(libVersion, libVersionDependencies)
  ) {
    console.error(
      `Библиотека ${libName} с версией ${libVersion} в peerDependencies,` +
        `отличается от версии ${libVersionDependencies} в dependencies,` +
        `синхронизируйте версии!`
    );
    process.exit(1);
  }
});

console.log("Версии библиотек синхронизированы");
