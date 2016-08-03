const { resolve } = require('path');
const { statSync, createReadStream } = require('fs');
const { wrap } = require('co');

const { remove } = require('../../../util');
const { downloadsDir, executableName, executablePath, version } = require('../../constants');
const download = require('../download');

const res = {
  ok: true,
  body: createReadStream(resolve(__dirname, 'bitcoin.zip'))
};

describe('download', function () {

  it('does the right thing', wrap(function*() {

    const gen = download((...args) => [...args]);

    let v;

    yield [remove(downloadsDir), remove(executablePath)];

    // getInstalledVersion
    gen.next();

    // fetch
    v = gen.next().value;
    v[0].should.match(/^http/);
    v[1].method.should.equal('get');

    // ensureDir
    yield gen.next(res).value;
    statSync(downloadsDir).isDirectory().should.equal(true);

    // readStream promise
    yield gen.next(res).value;

    // decompress
    yield gen.next().value;
    statSync(resolve(downloadsDir, executableName)).isFile().should.equal(true);

    // rename
    yield gen.next().value;
    statSync(executablePath).isFile().should.equal(true);

    // recheck installed version
    gen.next();

    // end of generator
    gen.next(version).should.deep.equal({ value: undefined, done: true });

    yield [remove(downloadsDir), remove(executablePath)];

  }));

});
