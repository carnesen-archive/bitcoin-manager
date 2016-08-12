'use strict';

const exec = require('child_process');

module.exports = function* getVersion(bitcoindPath) {

  const stderr = yield new Promise((resolve, reject) => {
    exec(bitcoindPath + ' --version', (error, stderr) => {
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
