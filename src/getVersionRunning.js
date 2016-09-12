'use strict';

const pm2p = require('@carnesen/pm2-as-promised');

const C = require('./constants');
const log = require('./log');

module.exports = function* getVersionRunning() {

  log.info(`Checking existing version of ${ C.bitcoind }`);

  const description = yield pm2p.describe(C.bitcoind);

};
