'use strict';

const foldercreate = require('..');
const assert = require('assert').strict;

assert.strictEqual(foldercreate(), 'Hello from foldercreate');
console.info("foldercreate tests passed");
