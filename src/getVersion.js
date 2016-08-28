'use strict';

const { exec } = require('child_process');

const { throwIfNotString } = require('@carnesen/util');

const { getExecutablePath } = require('./constants');

module.exports = function* getVersion(binDir) {

  throwIfNotString(binDir, 'binDir');

  const command = `"${ getExecutablePath(binDir) }" --version` ;

  const stderr = yield new Promise((resolve, reject) => {
    exec(command, (error, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stderr);
      }
    });
  });

  const matches = stderr.match(/\d+\.\d+\.\d+/);

  if (!matches) {
    throw new Error(`Expected to find version string in output of ${ command }`);
  }

  return matches[0];

};
