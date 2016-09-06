'use strict';

const { exec } = require('child_process');

const { throwIfNotString } = require('@carnesen/util');

const { getExecutablePath } = require('./constants');
const log = require('./log');

module.exports = function* getVersion(binDir) {

  throwIfNotString(binDir, 'binDir');

  const executablePath = getExecutablePath(binDir);

  log.info(`Checking existing version of ${ executablePath }`);

  const command = `"${ executablePath }" --version`;

  const stderr = yield new Promise((resolve, reject) => {
    exec(command, (error, stderr) => {
      if (error && error.code === 1) {
        resolve(stderr);
      } else {
        reject(new Error(`Expected ${ command } to exit with status code 1`));
      }
    });
  });

  const matches = stderr.match(/\d+\.\d+\.\d+/);

  if (!matches) {
    throw new Error(`Expected to find version string in output of ${ command }`);
  }

  return matches[0];

};
