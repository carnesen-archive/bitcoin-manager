'use strict';

const path = require('path');

const { throwIfNotPositiveLengthString } = require('@carnesen/util');
const conf = require('@carnesen/bitcoin-conf');

const constants = require('./constants');
const download = require('./download');
const spawn = require('./spawn');

module.exports = function* start({ version }) {

  throwIfNotPositiveLengthString(version, 'version');

  const confFilePath = conf.constants.defaultConfFilePath;

  const binDir = path.resolve(path.dirname(confFilePath), 'software', version);

  yield download({ version, binDir });

  return yield spawn({ binDir, confFilePath });

};
