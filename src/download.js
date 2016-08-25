'use strict';

const {createWriteStream} = require('fs');
const {platform, arch} = require('os');
const {basename, resolve} = require('path');

const decompress = require('decompress');
const nodeFetch = require('node-fetch');
const tmp = require('tmp');
const {ensureDir, rename} = require('@carnesen/fs');

const {executableName} = require('./constants');
const debug = require('./debug');

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


module.exports = function* download({version, binDir, fetch = nodeFetch}) {

  const url =
    `https://bitcoin.org/bin/bitcoin-core-${ version }/bitcoin-${ version }-${ urlEnding }`;

  debug(`GET ${ url }`);

  const res = yield fetch(url, {method: 'get'});

  if (!res.ok) {
    throw new Error('Failed to fetch from ' + url);
  }

  const writeStream = createWriteStream(filePath);

  yield new Promise((resolve, reject) => {
    res.body.pipe(writeStream)
      .on('error', reject)
      .on('close', resolve);
  });

  yield decompress(filePath, downloadsDir, {
    filter: file => file.path.match('bin/' + executableName),
    map: file => Object.assign(file, {path: executableName})
  });

  yield rename(resolve(downloadsDir, executableName), executablePath);

};
