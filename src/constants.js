'use strict';

const { resolve } = require('path');
const { arch, platform } = require('os');

// example URLs
// https://bitcoin.org/bin/bitcoin-core-0.12.1/bitcoin-0.12.1-win64.zip
// https://bitcoin.org/bin/bitcoin-core-0.12.1/bitcoin-0.12.1-osx64.tar.gz
// https://bitcoin.org/bin/bitcoin-core-0.12.1/bitcoin-0.12.1-win32.zip
// https://bitcoin.org/bin/bitcoin-core-0.12.1/bitcoin-0.12.1-linux64.tar.gz

let urlEnding;

switch (platform()) {

  case 'darwin':
    urlEnding = 'osx64.tar.gz';
    break;

  case 'win32':
    urlEnding = arch() === 'x64' ? 'win64.zip' : 'win32.zip';
    break;

  case 'linux':
    urlEnding = arch() === 'x64' ? 'linux64.tar.gz' : 'linux32.tar.gz';
    break;

  default:
    throw new Error('Unsupported platform ' + platform());

}

const executableName = platform() === 'win32' ? 'bitcoind.exe' : 'bitcoind';

module.exports = {
  executableName,
  getExecutablePath: binDir => resolve(binDir, executableName),
  getUrl: version =>
    `https://bitcoin.org/bin/bitcoin-core-${ version }/bitcoin-${ version }-${ urlEnding }`
};
