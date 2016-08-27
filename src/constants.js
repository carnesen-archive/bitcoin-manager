'use strict';

const { platform } = require('os');

module.exports = {
  executableName: platform() === 'win32' ? 'bitcoind.exe' : 'bitcoind',
};
