'use strict';

const childProcess = require('child_process');

const { throwIfNotString } = require('@carnesen/util');

const log = require('./log');

module.exports = function getBitcoindVersion(executablePath, exec = childProcess.exec) {

  throwIfNotString(executablePath, 'executablePath');

  log.debug(`getBitcoindVersion: executablePath = ${ executablePath }`);

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
            const version = matches[0];
            log.debug(`getBitcoindVersion: found ${ version }`);
            resolve(version);
          }
        } else {
          log.debug('getBitcoindVersion: resolving "undefined"');
          resolve();
        }
      } else {
        reject(new Error(`Expected exec "${ command }" to error`));
      }
    });
  });

};
