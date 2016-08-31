'use strict';

const childProcess = require('child_process');

const { waitForNonEvent } = require('@carnesen/util');

const { getExecutablePath } = require('./constants');

module.exports = function* spawn({ binDir, datadir, interval = 1500 }) {

  const executablePath = getExecutablePath(binDir);

  const child = childProcess.spawn(executablePath, [`--datadir="${ datadir }"`], {
    cwd: datadir,
    stdio: 'ignore'
  });

  yield [
    waitForNonEvent(child, 'error', interval),
    waitForNonEvent(child, 'exit', interval)
  ];

  return child;

};
