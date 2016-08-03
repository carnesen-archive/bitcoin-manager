'use strict';

const childProcess = require('child_process');

module.exports = {

  exec(parts, options) {
    return new Promise((resolve, reject) => {
      childProcess.exec(parts.join(' '), options, (error, stderr, stdout) => {
        if (error) {
          return reject(error);
        } else {
          return resolve({ stderr, stdout });
        }
      });
    });
  }

};
