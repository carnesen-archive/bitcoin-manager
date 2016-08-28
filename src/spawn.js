'use strict';

const { spawn: _spawn } = require('child_process');

const { waitForNonEvent } = require('@carnesen/util');

const { getExecutablePath } = require('./constants');

const interval = 1500;

module.exports = function* spawn({ binDir, datadir }) {

  const executablePath = getExecutablePath(binDir);

  const child = _spawn(executablePath, [`--datadir="${ datadir }"`], {
    cwd: datadir,
    stdio: 'ignore'
  });

  yield [
    waitForNonEvent(child, 'error', interval),
    waitForNonEvent(child, 'exit', interval)
  ];

  return child;

};
