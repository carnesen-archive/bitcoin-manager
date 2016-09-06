'use strict';

const path = require('path');

const { throwIfNotPositiveLengthString } = require('@carnesen/util');
const conf = require('@carnesen/bitcoin-conf');

const constants = require('./constants');
const download = require('./download');
const log = require('./log');
const spawn = require('./spawn');

function* launch({ version }) {

  throwIfNotPositiveLengthString(version, 'version');

  const confFilePath = conf.constants.defaultConfFilePath;

  const binDir = path.resolve(path.dirname(confFilePath), 'software', version);

  yield download({ version, binDir });

  return yield spawn({ binDir, confFilePath });

}

launch.log = log;
launch.constants = constants;

module.exports = launch;
