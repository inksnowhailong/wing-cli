const load = require("load-pkg");
module.exports = {
  vite: {
    preValid() {},
    async create() {
      const pkgData = await load();
    },
  },
  "vue-cli": {
    create() {},
  },
};
