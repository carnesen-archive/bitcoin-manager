'use strict';

const pm2p = require('@carnesen/pm2-as-promised');

const getBitcoindVersion = require('./getBitcoindVersion');
const { bitcoind } = require('./constants');
const log = require('./log');

module.exports = function* getVersionRunning() {

  log.debug('getVersionRunning');

  const descriptions = yield pm2p.describe(bitcoind);

  if (descriptions.length === 0) {
    log.debug(`getVersionRunning: ${ bitcoind } has not been started`);
    return;
  }

  if (descriptions.length > 1) {
    const message = `Expected to find 0 or 1 instance of ${ bitcoind }. Found ${ descriptions.length }`;
    throw new Error(message);
  }

  const { status, pm_exec_path } = descriptions[0].pm2_env;

  if (status !== 'online') {
    log.debug(`getVersionRunning: ${ bitcoind } status is ${ status }`);
    return;
  }

  log.debug('getRunningVersion: status is "online"');

  return yield getBitcoindVersion(pm_exec_path);

};
