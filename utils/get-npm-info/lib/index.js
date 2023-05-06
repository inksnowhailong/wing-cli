"use strict";

module.exports = {
  getNpmInfo,
  getNpmVersion,
  getNpmSemverVersion,
  getNpmVersion,
  checkNpmVersion,
  checkVersionCommand,
};
const axios = require("axios");
const urljoinImp = import("url-join");
const semver = require("semver");
const readPkgUp = require("read-pkg-up");
const inquirer = require("inquirer");
const colors = require("colors");
const { execSync, exec, execFile } = require("child_process");
// 获取 npm包在npm网中的信息
async function getNpmInfo(npmName, registry) {
  if (!npmName) return null;
  const { default: urljoin } = await urljoinImp;
  const registryUrl = registry || getDefaultRegistry();
  const npmInfoUrl = urljoin(registryUrl, npmName);
  try {
    return axios
      .get(npmInfoUrl, {
        timeout: 10000,
      })
      .then((res) => {
        if (res.status !== 200) return null;
        return res.data;
      })
      .catch((err) => {
        console.log("err.message :>> ", err.response?.data?.error);
        return false;
      });
  } catch (error) {
    console.log("error :>> ", error);
    // colors.red('请求失败，')
  }
}
// 获取默认 npm远程地址
function getDefaultRegistry(isOriginal = false) {
  // 判断是否原生
  const registryUrl = execSync("npm config get registry").toString().trim();
  return isOriginal ? "https://registry.npmjs.org" : registryUrl;
}
// 获取 所有版本
async function getNpmVersion(npmName, registry) {
  const data = await getNpmInfo(npmName, registry);
  if (data) {
    return Object.keys(data.versions);
  } else {
    return [];
  }
}
// 筛选出 大于基础版本的版本号
function getSemverVersion(baseVersion, versions) {
  versions = versions
    .filter((version) => {
      return semver.gt(version, baseVersion);
    })
    .sort((a, b) => semver.gt(b, a));
  return versions;
}
// 筛选出  大于基础版本的版本号  自动获取所有版本号 并返回最新版本
async function getNpmSemverVersion(baseVersion, npmName, registry) {
  const versions = await getNpmVersion(npmName, registry);

  const newVersions = getSemverVersion(baseVersion, versions);
  if (newVersions && newVersions.length > 0) {
    return newVersions[newVersions.length - 1];
  }
}
// 检查指定包的大于指定版本号的情况
async function checkNpmVersion(npmName, currentVersion) {
  // 获取所有 版本号
  const lastVersion = await getNpmSemverVersion(currentVersion, npmName);
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    return [npmName, lastVersion];
  }
  return false;
  /*
    log.warn(
      `当前最新版为${lastVersion}`,
      `当前版本为${currentVersion},请手动更新到最新版本`
    );
    log.info("版本更新命令:", colors.yellow(`npm i -g ${npmName}`));
  */
}
async function checkVersionCommand(program) {
  program
    .command("npmUpdate [args...]")
    .description("检查当前目录下的pkg 并选择要检查哪些包的更新")
    .action(async (npms) => {
      const {
        packageJson: { dependencies, devDependencies },
      } = await readPkgUp();
      // 预备命令
      let updateCommand = "npm i --save ";

      const allPkg = { ...dependencies, ...devDependencies };
      let updateList = [];
      // 使用命令行传递的 还是弹出提问
      if (npms.length > 0) {
        updateList = npms;
      } else {
        const backData = await inquirer.prompt([
          {
            type: "checkbox",
            name: "updateList",
            message: "请选择要检查更新的所有包",
            choices: [
              new inquirer.Separator(colors.blue("vvv==开发依赖==vvv")),
              ...Object.keys(dependencies || {}),
              new inquirer.Separator(colors.blue("vvv==运行依赖==vvv")),
              ...Object.keys(devDependencies || {}),
            ].map((key) => {
              return {
                name: key,
                value: key,
                short: [key] + "==>" + allPkg[key] + "\t",
              };
            }),
          },
        ]);
        updateList = backData.updateList;
      }
      console.log("updateList :>> ", updateList);
      // 全部的promise
      const allCheck = updateList.map((npmItem) => {
        return checkNpmVersion(
          npmItem,
          allPkg[npmItem].replace("^", "").replace("~", "")
        );
      });
      // 一起请求获取
      const allCheckRes = await axios.all(allCheck);
      const needUpdate = new Map(allCheckRes.filter((i) => i));

      if (!needUpdate.size) {
        return console.log(colors.blue(`没有需要更新的包`));
      }
      console.log(colors.blue(`需要更新的node包：`));
      // 输出提示
      for (const [key, version] of needUpdate) {
        console.log(`${key} ==>>  ${version}`);
        updateCommand += key + "@" + version + "";
      }

      if (npms.length == 0) {
        const { confirm } = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirm",
            message: "确定要更新这些包吗",
          },
        ]);
        if (confirm) {
          updateMethod();
        }
      } else {
        updateMethod();
      }

      function updateMethod() {
        console.log(colors.green("更新中=========>"));
        console.log("updateCommand :>> ", updateCommand);
        exec(
          updateCommand,
          {
            cwd: process.cwd(),
            // timeout: 1,
            encoding: "utf8",
          },
          (error, stdout, stderr) => {
            console.log(error, stdout, stderr);
          }
        );
      }
    })
    .alias("up");
}
