#! /usr/bin/env node

const importLocal = require("import-local");
// 本地开发打印文字
if (importLocal(__filename)) {
  require("npmlog").info("cli", "正在使用本地版本");
} else {
  // /如果是正常使用 就引入文件并执行  传入命令行参数
  require("../lib")(process.argv.slice(2));
}
