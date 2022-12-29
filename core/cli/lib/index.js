'use strict';

module.exports = core;

const pkg   = require('../package.json')
const log = require('@wing-cli/log')
/* 
   require:.js/.json.node
   require 对这三种文件引入会进行解析 以不同方式进行解析
   .js:要求有 module.exports/exports
   .json:要求能通过JSON.parse验证的json对象
   .node:要求是c++插件 通过process.dlopen去打开一个c++插件
   如果是其他任何文件 则都会以.js的方式进行解析
*/

function core() {
   checkPkgVersion()
}

function checkPkgVersion() {
   log.notice('cli-version',pkg.version)
}
