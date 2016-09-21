'use strict';

const path = require('path');

const pm2p = require('@carnesen/pm2-as-promised');
const { delay, throwIfNotPositiveLengthString } = require('@carnesen/util');
const conf = require('@carnesen/bitcoin-conf');

const getRunningVersion = require('./getRunningVersion');
const { bitcoind, getExecutablePath } = require('./constants');
const log = require('./log');
const download = require('./download');
const stop = require('./stop');

module.exports = function* start({ version, interval = 1500 }) {

  throwIfNotPositiveLengthString(version, 'version');

  let runningVersion = yield getRunningVersion();

  if (version === runningVersion) {
    log.info(`${ bitcoind } version ${ version } is already running`);
    return;
  }

  yield stop();

  const confFilePath = conf.constants.defaultConfFilePath;

  const binDir = path.resolve(path.dirname(confFilePath), 'software', version);

  yield download({ version, binDir });

  const executablePath = getExecutablePath(binDir);

  log.info(`Starting ${ executablePath }`);
  yield pm2p.start(executablePath, {
    name: bitcoind,
    exec_interpreter: 'none',
    args: `--conf="${ confFilePath }"`
  });

  log.info(`Waiting to see if ${ bitcoind } is still running after ${ interval / 1000 } seconds`);
  yield delay(interval);

  runningVersion = yield getRunningVersion();
  if (version !== runningVersion) {
    throw new Error(`Failed to start ${ bitcoind }`);
  }

};
