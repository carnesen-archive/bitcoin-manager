'use strict';

const { createWriteStream } = require('fs');

const decompress = require('decompress');
const nodeFetch = require('node-fetch');
const { createTmpDir, createTmpFile, ensureDir, rename } = require('@carnesen/fs');
const { throwIfNotPositiveLengthString } = require('@carnesen/util');

const getVersion = require('./getVersion');
const { executableName, getExecutablePath, getUrl } = require('./constants');
const debug = require('./debug');

module.exports = function* download({ version, binDir, fetch = nodeFetch }) {

  throwIfNotPositiveLengthString(version, 'version');
  throwIfNotPositiveLengthString(binDir, 'binDir');

  let versionFound;
  try {
    versionFound = yield getVersion(binDir);
    if (versionFound === version) {
      return;
    }
  } catch (ex) {
    // probably means the file doesn't exist
    debug(ex);
  }

  const url = getUrl(version);

  debug(`GET ${ url }`);

  const [ tmpFilePath, tmpFileDescriptor ] = yield createTmpFile();

  const res = yield fetch(url, { method: 'GET' });

  if (!res.ok) {
    throw new Error('Failed to fetch from ' + url);
  }

  const writeStream = createWriteStream(undefined, {
    fd: tmpFileDescriptor
  });

  yield new Promise((resolve, reject) => {
    res.body.pipe(writeStream)
      .on('error', reject)
      .on('close', resolve);
  });

  debug(`GOT ${ url }`);

  const tmpDir = yield createTmpDir({ unsafeCleanup: true });

  debug(`Extracting ${ executableName }`);

  yield decompress(tmpFilePath, tmpDir, {
    filter: file => file.path.match('bin/' + executableName),
    map: file => Object.assign(file, { path: executableName })
  });

  yield ensureDir(binDir);

  yield rename(getExecutablePath(tmpDir), getExecutablePath(binDir));

  versionFound = yield getVersion(binDir);

  if (versionFound !== version) {
    throw new Error(`Expected downloaded version to be "${ version}", found "${ versionFound }"`);
  }

};
