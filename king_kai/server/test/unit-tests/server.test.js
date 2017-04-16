const assert = require('chai').assert;
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Server = require('../../lib/models/server');

describe('Server model', () => {
  it('Validates server model', done => {
    const testServer = new Server({
      cpuLoad: [1, 2, 3],
      memoryUse: 123555,
      diskUse: {
        used: 445,
        free: 125
      },
      topProcesses: [{
        name: 'uwsgi',
        cpu: 1235,
        pid: 59
      }],
      dataStores: [{
        name: 'postgres',
        cpu: 15134,
        memory: 1358,
        port: 8080
      }]
    });

    testServer.validate(err => {
      assert.isNotOk(err);
      done(err);
    });
  });
});