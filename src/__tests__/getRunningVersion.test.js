const { wrap } = require('co');

const pm2p = require('@carnesen/pm2-as-promised');
const { isUndefined } = require('@carnesen/util');

const getRunningVersion = require('../getRunningVersion');

function makeDescriptions(status) {
  return [{
    pm2_env: {
      status,
      pm_exec_path: 'foo',
    }
  }];
}

describe('getRunningVersion', function () {

  it('returns undefined if bitcoind is not running', wrap(function* () {
    yield pm2p.killDaemon();
    const version = yield getRunningVersion();
    isUndefined(version).should.equal(true);
  }));

  it('throws if pm2.describe returns an array of length greater than 1', function () {
    const gen = getRunningVersion();
    gen.next();
    (() => gen.next([0, 1])).should.throw('0 or 1')
    ;
  });

  it('returns undefined if status is not "online"', function () {
    const gen = getRunningVersion();
    gen.next(); // describe
    gen.next(makeDescriptions('stopped')).should.deep.equal({ value: undefined, done: true });
  });

  it('returns getBitcoindVersion if status is "online"', function () {
    const gen = getRunningVersion();
    gen.next(); // describe
    const v = gen.next(makeDescriptions('online')).value;
    v.should.be.a('promise');
  });

});
