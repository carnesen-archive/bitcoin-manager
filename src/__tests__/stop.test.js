
const { resolve } = require('path');

const { wrap } = require('co');
const pm2p = require('@carnesen/pm2-as-promised');

const { bitcoind } = require('../constants');
const stop = require('../stop');

describe('stop', function () {

  it('catches "not found"', wrap(function* () {
    yield pm2p.killDaemon();
    yield stop();
    const list = yield pm2p.list();
    list.length.should.equal(0);
  }));

  it('does the right thing', wrap(function* () {
    yield pm2p.killDaemon();
    yield pm2p.start(resolve(__dirname, 'bitcoind'), { name: bitcoind });
    yield stop();
    const list = yield pm2p.list();
    list.length.should.equal(0);
  }));

  it('re-throws on a non-"not found" error', function () {
    const gen = stop();
    gen.next(); //pm2p.delete
    try {
      gen.throw(new Error('foo'));
      throw 'bar';
    } catch (ex) {
      ex.message.should.equal('foo');
    }
  });

});
