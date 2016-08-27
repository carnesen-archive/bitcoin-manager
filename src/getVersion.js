'use strict';

const { resolve } = require('path');
const { exec } = require('child_process');

const { throwIfNotString } = require('@carnesen/util');

const { executableName } = require('./constants');

module.exports = function* getVersion(binDir) {

  throwIfNotString(binDir, 'binDir');

  const stderr = yield new Promise((resolve, reject) => {
    exec(`"${ resolve(binDir, executableName) }" --version`, (error, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stderr);
      }
    });
  });

  const matches = stderr.match(/\d+\.\d+\.\d+/);

  if (!matches) {
    throw new Error('Expected to find version string in output of "bitcoind --version"');
  }

  return matches[0];

};
