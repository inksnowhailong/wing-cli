"use strict";
// import log from "@wing-cli/log";

const inquirer = require("inquirer");
const allType = require("./allType");
const fs = require("fs");
const { resolve } = require("path");
module.exports = vscodeDebugger;

function vscodeDebugger(program) {
  program
    .command("vsdebugger-init")
    .description(
      "初始化/更新 项目的vscode调式程序的配置文件,将package.josn里的scripts，转变为vscode运行配置"
    )
    .action(async () => {
      // 所有的预设处理类型
      const types = Object.keys(allType);
      const progectType = await inquirer.prompt({
        type: "list",
        name: "type",
        message: "选择要配置vscode调试文件的类型",
        choices: types,
        default: types[0],
      });
      // 查看根目录 是否已经有vscode配置文件
      initLaunch();
      // 执行创建
      allType[progectType.type].preValid?.();
      allType[progectType.type].create?.();
    })
    .alias("dinit");
}

function initLaunch() {
  const vscodePath = resolve(process.cwd(), "./.vscode");
  const launchPath = resolve(process.cwd(), "./.vscode/launch.json");

  if (!fs.existsSync(vscodePath)) {
    fs.mkdirSync(vscodePath, { recursive: true });
  }
  if (!fs.existsSync(launchPath)) {
    fs.writeFile(launchPath);
  }

}
