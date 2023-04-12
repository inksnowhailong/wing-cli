'use strict';

const vscodeDebugger = require('..');
const assert = require('assert').strict;

assert.strictEqual(vscodeDebugger(), 'Hello from vscodeDebugger');
console.info("vscodeDebugger tests passed");
