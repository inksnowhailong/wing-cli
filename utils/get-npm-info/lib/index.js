"use strict";

module.exports = {
  getNpmInfo,
  getNpmVersion,
  getNpmSemverVersion,
  getNpmVersion,
};
const axios = require("axios");
const urljoinImp = import("url-join");
const semver = require("semver");
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
