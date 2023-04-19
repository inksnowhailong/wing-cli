"use strict";
// 使用commander来注册脚手架  比 yargs更简洁
const gitCommand = require("@wing-cli/git-command");
const folderCreate = require("@wing-cli/folder-create");
const vscodeDebugger = require("@wing-cli/vscode-debugger");
const { checkVersionCommand } = require("@wing-cli/get-npm-info");
module.exports = commandAdd;

function commandAdd(program) {
  //   program.addCommand(gitCommand());
  // git相关命令注册
  gitCommand(program);
  // 目录模板快速创建
  folderCreate(program);
  // vscode 配置生成
  // vscodeDebugger(program);
  // 版本工具
  checkVersionCommand(program);
}
