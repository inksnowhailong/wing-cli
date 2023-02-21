"use strict";
// 使用commander来注册脚手架  比 yargs更简洁
const { execSync, exec, execFile } = require("child_process");
const { resolve } = require("path");
const log = require("@wing-cli/log");
module.exports = gitCommand;

function gitCommand(program) {
  // const gitCommand = new commander.Command("git");
  program
    .command("Gpush <commit>")
    .description("一次性 拉取并推送远程库,出问题会报错")
    .action((commit) => {
      if (!commit) {
        return log.error("必须指定commit内容");
      }
      log.info(commit);
      // 连续运行命令
      execFunc([
        "git pull",
        "git add .",
        `git commit -m '${commit}'`,
        "git push",
      ]);
    })
    .alias("gp");
  program
    .command("Gbush")
    .description("当前目录打开git bush")
    .action((prot) => {
      const gitPath = execSync("where git").toString();
      const gitExe = resolve(gitPath, "../../../git-bash.exe");
      // const commandStr = `start "" "${gitExe}" -c "cd ${process.cwd()};bash;" `
      // const commandStr = `  cd  ${process.cwd()} &&  "${gitExe}" `
      exec(
        gitExe,
        {
          cwd: process.cwd(),
          // 设置了这个timeout不为0 时候 打开了git后会直接退出程序 然后继续等待命令，否则会卡在一个等待状态
          timeout: 1,
          maxBuffer: 10485760,
        },
        (err, out, serr) => {
          console.log(err);
          console.log(out);
          console.log(serr);
        }
      );
    })
    .alias("gb");
  /*

    */
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
      stdout && log.info(`命令 ${codes[0]}:`, stdout);
      error && log.info(`命令 ${codes[0]}:`, error);
      stderr && log.info(`命令 ${codes[0]}:`, stderr);

      execFunc(codes.slice(1));
    }
  );
}
