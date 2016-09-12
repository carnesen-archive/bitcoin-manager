//
// const getVersionRunning = require('../getVersionRunning');
//
// describe('getVersionRunning', function () {
//
//   it('throws if version returned does not contain a semver string', function () {
//     const gen = getVersionRunning('');
//     gen.next(); // exec promise
//     (() => gen.next('blah no semver here blah')).should.throw('version string');
//   });
//
//   it('returns version if all goes as planned', function () {
//     const gen = getVersionRunning('');
//     gen.next(); // exec promise
//     gen.next('blah 1.2.3 blah').should.deep.equal({ value: '1.2.3', done: true });
//   });
//
// });
