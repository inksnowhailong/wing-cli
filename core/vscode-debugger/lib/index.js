"use strict";
const log = require("@wing-cli/log");

module.exports = vscodeDebugger;

function vscodeDebugger(program) {
  program
    .command("vsdebugger-init [type]")
    .description("初始化 项目的vscode调式程序的配置文件")
    .action((type = "vite") => {
      log.info(type);
    })
    .alias("dinit");
}
