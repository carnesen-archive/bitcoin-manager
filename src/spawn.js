'use strict';

const childProcess = require('child_process');

const split = require('split');
const { waitForNonEvent } = require('@carnesen/util');

const { getExecutablePath } = require('./constants');
const log = require('./log');

module.exports = function* spawn({ binDir, confFilePath, interval = 1500 }) {

  const executablePath = getExecutablePath(binDir);

  log.info(`Spawning ${ executablePath } as a child process`);

  const args = [
    `--conf="${ confFilePath }"`,
    '--printtoconsole'
  ];

  const child = childProcess.spawn(executablePath, args);

  child.stdout.pipe(split()).on('data', line => log.info(line));
  child.stderr.pipe(split()).on('data', line => log.error(line));

  yield [
    waitForNonEvent(child, 'error', interval),
    waitForNonEvent(child, 'exit', interval)
  ];

  return child;

};
