/* eslint-disable @typescript-eslint/no-var-requires */
const url = require("@rollup/plugin-url");
const { createFilter } = require("@rollup/pluginutils");

const pluginUrl = url({
  include: [/.svg/],
});

const svgURLPlugin = () => {
  const filter = createFilter(/.svg\?url/);

  return {
    name: "svgURL",
    load(id) {
      if (!filter(id)) {
        return null;
      }

      const newId = id.replace("?url", "");

      return pluginUrl.load(newId);
    },
    generateBundle(...args) {
      return pluginUrl.generateBundle(...args);
    },
  };
};

module.exports = {
  svgURLPlugin,
};
