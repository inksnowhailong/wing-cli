"use strict";
// 使用commander来注册脚手架  比 yargs更简洁
const gitCommand = require("@wing-cli/git-command");
module.exports = commandAdd;

function commandAdd(program) {
  //   program.addCommand(gitCommand());
  // git相关命令注册
  gitCommand(program);
}
