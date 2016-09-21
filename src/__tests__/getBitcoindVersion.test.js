
const { isUndefined } = require('@carnesen/util');
const getBitcoindVersion = require('../getBitcoindVersion');

function makeExec(error, stderr) {
  return function exec(command, callback) {
    callback(error, stderr);
  };
}

describe('getBitcoindVersion', function () {

  it('throws if no argument is provided', function () {
    (() => getBitcoindVersion()).should.throw('string');
  });

  it('rejects if exec does not return an error', function () {
    return getBitcoindVersion('foo', makeExec())
      .then(() => { throw 'foo'; })
      .catch(err => err.message.startsWith('Expected').should.equal(true));
  });

  it('resolves version if stderr contains a semver string', function () {
    return getBitcoindVersion('foo', makeExec({ code: 1 }, 'blah 1.2.3 blah'))
      .then(version => version.should.equal('1.2.3'));
  });

  it('rejects if stderr does not contain a semver string', function () {
    return getBitcoindVersion('foo', makeExec({ code: 1 }, 'blah blah'))
      .then(() => { throw 'foo'; })
      .catch(err => err.message.startsWith('Expected to find version string'));
  });

  it('resolves undefined on non-code=1 error', function () {
    return getBitcoindVersion('foo', makeExec({}))
      .then(version => isUndefined(version).should.equal(true));
  });

});
