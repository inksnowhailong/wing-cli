'use strict'

const log = require('npmlog')

// 自义定一个方法
log.addLevel('success', 2000, { fg: 'green', bold: true })
log.heading = 'wing：'
log.headingStyle = { fg: 'blue',  bold: true }
// 修改命令行

module.exports = log
