"use strict";

module.exports = core;

const pkg = require("../package.json");
const log = require("@wing-cli/log");
const constant = require("./const");
const semver = require("semver");
const { execFileSync } = require("child_process");
const userHome = require("user-home");
const { existsSync } = require("fs");
const path = require("path");
const pkgdir = import("pkg-dir");
const colors = require("colors");
const commands = require("./commands");
/*
   require:.js/.json.node
   require 对这三种文件引入会进行解析 以不同方式进行解析
   .js:要求有 module.exports/exports
   .json:要求能通过JSON.parse验证的json对象
   .node:要求是c++插件 通过process.dlopen去打开一个c++插件
   如果是其他任何文件 则都会以.js的方式进行解析
*/

let args, config;

async function core() {
  try {
    // 判断 pkg中的脚手架版本
    checkPkgVersion();
    // 判断node版本 需要高于最低版本号
    checknodeVersion();
    // 检查入参
    checkInputArgs();
    // 判断权限
    checkRoot();
    // 拿到主目录
    checkUserHome();
    // 检查 env
    checkEnv();
    // 检查脚手架更新
    if (args.debug) {
      await checkGlobalUpdate();
    }
    // 进入脚手架命令工具程序
    commands(args, config);
  } catch (error) {
    log.error(error);
  }
}
function checkPkgVersion() {
  log.notice("cli-version", pkg.version);
}

function checknodeVersion() {
  // 获取当前node 版本号
  const currentVersion = process.version;
  // 对比最低node版本号
  const lowestNodeVersion = constant.LOWEST_NODE_VERSION;
  if (semver.gte(lowestNodeVersion, currentVersion)) {
    throw new Error(`wing-cli 需要安装 ${lowestNodeVersion}以上版本的Node`);
  }
}

function checkRoot() {
  // 判断是否是管理员权限
  let Root;
  try {
    execFileSync("net", ["session"], { stdio: "ignore" });
    Root = true;
  } catch (e) {
    Root = false;
  }
  log.verbose(`权限状态：`, `当前${Root ? "是" : "不是"}管理员权限状态`);
}
function checkUserHome() {
  // 拿不到主目录 或者 主目录的路径不存在时候 抛出异常
  // 这里就是确保有主目录
  if (!userHome || !existsSync(userHome)) {
    throw new Error("当前登录用户主目录不存在");
  }
}

function checkInputArgs() {
  const minimist = require("minimist");

  args = minimist(process.argv.slice(2));
  // 查看是否有debug参数来决定 log库状态
  checkArgs();
}

function checkArgs() {
  if (args.debug || args.d) {
    process.env.LOG_LEVEL = "verbose";
  } else {
    process.env.LOG_LEVEL = "info";
  }
  // 设置 log的等级  因为默认 等级 在info  等级低于info的无法输出  所以 测试模式--debug时候 可以设置等级为verbose
  // verbose 来源于  npmlog的源码底部
  log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "info";
}

async function checkEnv() {
  const dotEnv = require("dotenv");
  const { packageDirectorySync } = await pkgdir;
  // TODO 使用glob库改造 获取所有.env开头文件 然后加入到process.env中，当前是固定的.env文件
  const pkgdirPath = packageDirectorySync();
  if (!pkgdirPath) {
    log.warn(`找不到package文件位置`);
    return;
  }
  const dotenvpath = path.resolve(pkgdirPath, ".env");
  if (existsSync(dotenvpath)) {
    config = dotEnv.config({ path: dotenvpath });
  }
  log.verbose("环境变量", config || "未检测到.env文件");
}

/*******
 * @npm @wing-cli/get-npm-info 获取npm上库信息
 * @npm semver 对比版本号
 * @npm log 输出内容
 * @return {*}
 */
async function checkGlobalUpdate() {
  // 获取当前版本号和库名
  const currentVersion = pkg.version;
  const npmName = pkg.name;
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
