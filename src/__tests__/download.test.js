const { resolve } = require('path');
const { createReadStream } = require('fs');

const { wrap } = require('co');

const { createTmpDir, stat } = require('@carnesen/fs');
const { getExecutablePath, getUrl } = require('../constants');
const download = require('../download');

const fetch = (...args) => [...args];

const res = {
  ok: true,
  body: createReadStream(resolve(__dirname, 'bitcoin.zip'))
};

const version = '1.2.3';

describe.only('download', function () {

  it('throws if no argument is provided', function () {
    (() => download()).should.throw('Cannot match');
  });

  it('exits early if existing version is equal to passed version', function () {
    const gen = download({ version, binDir: 'asdf', fetch });
    // getVersion
    gen.next();
    gen.next(version).should.deep.equal({ done: true, value: undefined });
  });

  it('downloads the software if it does not already exist', wrap(function*() {

    const binDir = yield createTmpDir({ unsafeCleanup: true });

    const gen = download( { version, binDir, fetch });

    let stats, v;

    // getVersion
    try {
      yield gen.next().value;
    } catch (ex) {
      ex.code.should.equal(127); // executable not found
    }

    // createTmpFile (throw getVersion)
    v = gen.throw().value;
    const [ tmpFilePath, tmpFileDescriptor] = yield v;

    // fetch (inject tmpFile)
    v = gen.next([ tmpFilePath, tmpFileDescriptor ]).value;
    v[0].should.equal(getUrl(version));
    v[1].method.should.equal('GET');

    // writeStream promise
    yield gen.next(res).value;

    const tmpDir = yield gen.next().value;

    // decompress (inject tmpDir)
    yield gen.next(tmpDir).value;
    stats = yield stat(getExecutablePath(tmpDir));
    stats.isFile().should.equal(true);

    // ensureDir
    yield gen.next().value;
    stats = yield stat(binDir);
    stats.isDirectory().should.equal(true);

    // rename
    yield gen.next().value;
    stats = yield stat(getExecutablePath(binDir));
    stats.isFile().should.equal(true);

    // recheck installed version
    gen.next();

    // end of generator
    gen.next(version).should.deep.equal({ value: undefined, done: true });

  }));

});
