"use strict";
// 使用commander来注册脚手架  比 yargs更简洁
const commander = require("commander");
const commandAdd = require("./commandAdd");
module.exports = commands;

function commands(args, config) {
  // 获取单例
  // const { program } = commander
  // 实例化 第二种方式
  const program = new commander.Command();
  program
    .name("wing")
    .usage("<command> [options]")
    .option("-d,--debug", "调试模式,包含对版本更新的检查", false);
  // 默认显示 help
  // program.outputHelp()

  // 注册命令 命令会返回命令对象 所以要单独去写 而不是直接在创建脚手架时候连写
  // 这里注册命令时候 <>里的参数 是必须的 []里的参数 是可选的
  // program
  //   .command("version")
  //   .description("输出脚手架版本")
  //   .action((str) => {
  //     // 参数会安顺寻获取 options  通过 --或者-来识别对应
  //     console.log(str);
  //   });

  // 安装脚手架其他模块
  commandAdd(program);
  // 必须在 注册命令后 parse  否则命令 无效
  program.parse(process.argv);
}
