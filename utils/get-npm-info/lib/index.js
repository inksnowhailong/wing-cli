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

// 获取 npm包在npm网中的信息
async function getNpmInfo(npmName, registry) {
  if (!npmName) return null;
  const { default: urljoin } = await urljoinImp;
  const registryUrl = registry || getDefaultRegistry();
  const npmInfoUrl = urljoin(registryUrl, npmName);
  return axios
    .get(npmInfoUrl, {
      timeout: 10000,
    })
    .then((res) => {
      if (res.status !== 200) return null;
      return res.data;
    })
    .catch((err) => {
      Promise.reject(err);
      return false;
    });
}
// 获取默认 npm远程地址
function getDefaultRegistry(isOriginal = true) {
  // 判断是否原生
  return isOriginal
    ? "https://registry.npmjs.org"
    : "https://registry.npm.taobao.org";
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
      return semver.satisfies(version, `^${baseVersion}`);
    })
    .sort((a, b) => semver.gt(b, a));
  return versions;
}
// 筛选出  大于基础版本的版本号  自动获取所有版本号 并返回最新版本
async function getNpmSemverVersion(baseVersion, npmName, registry) {
  const versions = await getNpmVersion(npmName, registry);
  const newVersions = getSemverVersion(baseVersion, versions);
  if (newVersions && newVersions.length > 0) {
    return newVersions[0];
  }
}
// 检查指定包的大于指定版本号的情况
async function checkNpmVersion(npmName, currentVersion) {
  // 获取所有 版本号
  const lastVersion = await getNpmSemverVersion(currentVersion, npmName);
  return lastVersion && semver.gt(lastVersion, currentVersion);
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
    .command("checkNpmVersion")
    .description("检查当前目录下的pkg 并选择要检查哪些包的更新")
    .action(async () => {
      (async () => {
        console.log(await readPkgUp());
      })();
    })
    .alias("cnv");
}
