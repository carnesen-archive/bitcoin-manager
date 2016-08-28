'use strict';

const { resolve } = require('path');

const { writeConfFile } = require('@carnesen/bitcoin-conf');

const download = require('./download');
const spawn = require('./spawn');

module.exports = function* launch({ datadir, version, options }) {

  yield writeConfFile({ datadir, options });

  const binDir = resolve(datadir, 'software', version);

  yield download({ version, binDir });

  return yield spawn({ binDir, datadir });

};
