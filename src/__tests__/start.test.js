//
// const { wrap } = require('co');
//
// const start = require('../start');
//
// describe('start', function () {
//
//   it('rejects if bitcoind is not found', wrap(function* () {
//     try {
//       yield start({ binDir: '.' });
//       throw 'asdf';
//     } catch (ex) {
//       ex.message.should.match(/not found/);
//     }
//   }));
//
//   // it('rejects if process does not last longer than interval', wrap(function* () {
//   //   try {
//   //     yield start({ binDir: __dirname, datadir: __dirname });
//   //   } catch (ex) {
//   //     ex.message.endsWith('"exit"').should.equal(true);
//   //   }
//   // }));
//
//   it('resolves if child lasts longer than interval', wrap(function* () {
//     yield start({ binDir: __dirname, interval: 1 });
//   }));
//
// });
