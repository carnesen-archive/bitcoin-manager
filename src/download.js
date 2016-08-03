'use strict';

const { basename, resolve } = require('path');
const { createWriteStream } = require('fs');

const decompress = require('decompress');
const nodeFetch = require('node-fetch');

const { ensureDir, rename } = require('../../util');
const { downloadsDir, executableName, url, version, executablePath } = require('./constants');
const getVersion = require('./getVersion');

const fileName = basename(url);
const filePath = resolve(downloadsDir, fileName);

module.exports = function* download({ fetch, }) {

  fetch = fetch || nodeFetch;

  let installedVersion = yield getVersion();

  if (version !== installedVersion) {

    log.info('Downloading Bitcoin Core version', version);

    const res = yield fetch(url, { method: 'get' });

    if (!res.ok) {
      throw new Error('Failed to fetch from ' + url);
    }

    yield ensureDir(downloadsDir);

    const writeStream = createWriteStream(filePath);

    yield new Promise((resolve, reject) => {
      res.body.pipe(writeStream)
        .on('error', reject)
        .on('close', resolve);
    });

    yield decompress(filePath, downloadsDir, {
      filter: file => file.path.match('bin/' + executableName),
      map: file => Object.assign(file, { path: executableName })
    });

    yield rename(resolve(downloadsDir, executableName), executablePath);

    installedVersion = yield getVersion();

    if (version !== installedVersion) {
      throw new Error('Expected installed version to be ' + version + '. Found ' + installedVersion);
    }

  }

};
