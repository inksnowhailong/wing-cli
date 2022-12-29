'use strict'

const log = require('npmlog')
// 设置 log的等级  因为默认 等级 在info  等级低于info的无法输出  所以 测试模式--debug时候 可以设置等级为verbose
// verbose 来源于  npmlog的源码底部
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'
// 自义定一个方法
log.addLevel('success', 2000, { fg: 'green', bold: true })
log.heading = '脚手架：'
log.headingStyle = { fg: 'blue',  bold: true }
module.exports = log
