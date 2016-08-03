
const { bitcoind } = require('../../../../sliceMap');

const getInstalledVersion = require('../getInstalledVersion');

describe('bitcoind manager getVersion', function () {

  it('gets the version', function () {

    const gen = getInstalledVersion();

    // exec promise
    gen.next().value.should.be.a('promise');

    // return
    gen.next({ stderr: 'blah 1.2.3 blah' }).should.deep.equal({ value: '1.2.3', done: true });
    bitcoind.getVersion().should.equal('1.2.3');

  });

});
