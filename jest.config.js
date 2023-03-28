/* eslint-disable @typescript-eslint/no-var-requires */

const jestBase = require("../../jest.config.js");

module.exports = {
  ...jestBase,
  rootDir: "../..",
  testMatch: [`${__dirname}/**/*.test.(js|jsx|ts|tsx)`],
};
