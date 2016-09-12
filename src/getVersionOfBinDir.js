'use strict';

const childProcess = require('child_process');

const { throwIfNotString } = require('@carnesen/util');

const { getExecutablePath } = require('./constants');
const log = require('./log');

module.exports = function getVersionOfBinDir(binDir, exec = childProcess.exec) {

  throwIfNotString(binDir, 'binDir');

  const executablePath = getExecutablePath(binDir);

  log.debug(`Checking version of bin directory ${ binDir }`);

  const command = `"${ executablePath }" --version`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stderr) => {
      if (error) {
        if (error.code === 1) {
          // command exiting with code 1 is expected
          const matches = stderr.match(/\d+\.\d+\.\d+/);
          if (!matches) {
            reject(new Error(`Expected to find version string in output of ${ command }`));
          } else {
            resolve(matches[0]);
          }
        } else {
          resolve();
        }
      } else {
        reject(new Error(`Expected exec "${ command }" to error`));
      }
    });
  });

};
