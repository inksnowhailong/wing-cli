"use strict";
// 使用commander来注册脚手架  比 yargs更简洁
const { execSync, exec, execFile } = require("child_process");
const { resolve } = require("path");
const log = require("@wing-cli/log");
module.exports = gitCommand;

function gitCommand(program) {
  program
    .command("Gpush [commit]")
    .description("一次性 拉取并推送远程库,出问题会报错")
    .action((commit) => {
      if (!commit) {
        return log.error("必须指定commit内容");
      }
      // 连续运行命令
      execFunc([

        "git add .",
        `git commit -m '${commit}'`,
         "git pull",
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
