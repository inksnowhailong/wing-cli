"use strict";
const log = require("@wing-cli/log");
const fs = require("fs");
const dedent = require("dedent");
module.exports = foldercreate;

function foldercreate(program) {
  program
    .command("folderCreate [template] [name]")
    .description("按模板 一次性创建文件目录")
    .option("--list", "输出所有可用模板")
    .action((template, name, option) => {
      if (option.list) {
        return alltemplate();
      }
      if (!template) {
        return log.error("必须指定模板");
      }
      if (!templates[template]) {
        return alltemplate();
      }
      if (!name) {
        return log.error("必须指定名字");
      }
      if (fs.existsSync(process.cwd() + "\\" + name)) {
        return log.error("文件夹已存在");
      }
      //   创建
      templates[template].created(process.cwd(), name);
      log.success("创建成功");
    })
    .alias("fc");
}

const templates = {
  v3view: {
    desc: "vue3+vite+ts+setup的view模板，由index.vue和hook目录构成",
    created(cwd, name) {
      const basePath = cwd + "\\" + name;
      fs.mkdirSync(basePath);
      createAndWrite(
        `${basePath}\\index.vue`,
        dedent`<script setup lang="ts">

      </script>
      <template>

        <div class="${name}"></div>

      </template>
      <style lang="less" scoped>

      </style>
      `
      );
      fs.mkdirSync(`${basePath}\\hook`);
      createAndWrite(
        `${basePath}\\hook\\index.ts`,
        dedent`export const data = {}`
      );
    },
  },
};
// 输出可用模板
function alltemplate() {
  Object.keys(templates).forEach((key) => {
    log.info(`模板 ${key}:`, ` ${templates[key].desc}`);
  });
  return;
}
// 创建并写入文件
function createAndWrite(path, data) {
  fs.openSync(path, "w+");
  fs.writeFileSync(path, data);
}
exports.templates = Object.keys(templates);
exports.alltemplate = alltemplate;
