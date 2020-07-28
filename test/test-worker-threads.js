'use strict';

const { Worker, isMainThread } = require('worker_threads');
const assert = require('assert');
const Mocha = require('mocha');

if (!isMainThread) {
  const mocha = new Mocha();
  mocha.addFile(`${__dirname}/test-single-process.js`);
  mocha.bail(true);
  mocha.reporter('base'); // don't print anything
  mocha.run((failures) => {
    process.exit(failures);
  });
} else {
  describe('rclnodejs in worker threads', function () {
    this.timeout(60 * 1000);

    it('works for single process tests', (done) => {
      const worker = new Worker(__filename);
      worker.once('exit', (code) => {
        assert.equal(code, 0);
        done();
      });
    });
  });
}
