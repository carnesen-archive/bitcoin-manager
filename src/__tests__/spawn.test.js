
const { wrap } = require('co');

const spawn = require('../spawn');

describe('spawn', function () {

  it('rejects ENOENT if bitcoind is not found', wrap(function* () {
    try {
      yield spawn({ binDir: '.', datadir: '.' });
    } catch (ex) {
      ex.value.code.should.equal('ENOENT');
    }
  }));

  it('rejects if process does not last longer than interval', wrap(function* () {
    try {
      yield spawn({ binDir: __dirname, datadir: __dirname });
    } catch (ex) {
      ex.message.endsWith('"exit"').should.equal(true);
    }
  }));

  it('resolves if child lasts longer than interval', wrap(function* () {
    yield spawn({ binDir: __dirname, datadir: __dirname, interval: 1 });
  }));

});
