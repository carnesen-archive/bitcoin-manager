'use strict';

const pm2p = require('@carnesen/pm2-as-promised');
const { bitcoind } = require('./constants');

module.exports = function* stop() {
  try {
    yield pm2p.delete(bitcoind);
  } catch (ex) {
    if (!ex.message.match(/not found/)) {
      throw ex;
    }
  }
};
