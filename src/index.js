'use strict';

const { wrap } = require('co');

const { }

const download = require('./download');

module.exports = wrap(function* spawn(options) {

  yield download();
  yield start();
});
