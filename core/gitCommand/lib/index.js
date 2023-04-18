"use strict";
// 使用commander来注册脚手架  比 yargs更简洁
const { execSync, exec, execFile } = require("child_process");
const { resolve } = require("path");
const log = require("@wing-cli/log");
module.exports = gitCommand;

function gitCommand(program) {
  // const gitCommand = new commander.Command("git");
  program
    .command("Gpush [commit]")
    .description("一次性 拉取并推送远程库,出问题会报错")
    .action((commit) => {
      if (!commit) {
        return log.error("必须指定commit内容");
      }
      // 连续运行命令
      execFunc([
        "git pull",
        "git add .",
        `git commit -m '${commit}'`,
        "git push",
      ]);
    })
    .alias("gp");
}

function execFunc(codes) {
  if (!codes[0]) return;
  exec(
    codes[0],
    {
      cwd: process.cwd(),
      // timeout: 1,
      encoding: "utf8",
    },
    (error, stdout, stderr) => {
      (stdout || error || stderr) &&
        log.info(`命令 ${codes[0]}信息:`, `${stdout}\n${error}\n${stderr}`);
      // error.trim() && log.info(`命令 ${codes[0]}:`, error);
      // stderr.trim() && log.info(`命令 ${codes[0]}:`, stderr);

      execFunc(codes.slice(1));
    }
  );
}
async function checkGlobalUpdate(npmName, currentVersion) {
  // 获取所有 版本号
  const { getNpmSemverVersion } = require("@wing-cli/get-npm-info");
  const lastVersion = await getNpmSemverVersion(currentVersion, npmName);
  // 对比并提示更新
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(
      `当前最新版为${lastVersion}`,
      `当前版本为${currentVersion},请手动更新到最新版本`
    );
    log.info("版本更新命令:", colors.yellow(`npm i -g ${npmName}`));
  }
}
