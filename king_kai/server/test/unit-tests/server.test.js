const assert = require('chai').assert;
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Server = require('../../lib/models/server');

describe('Server model', () => {
  it('Validates server model', done => {
    const testServer = new Server({
      HandshakeSecret: '',
      bootTime: 1234,
      hostid: 'testID',
      hostname: 'testHost',
      kernelVersion: 'testKernel',
      os: 'testOS',
      platform: 'testPlatform',
      platformFamily: 'testFamily',
      platformVersion: 'testVersion',
      procs: 85859,
      uptime: 135858,
      virtualizationRole: 'testRole',
      virtualizationSystem: 'testSystem'
    });

    testServer.validate(err => {
      assert.isNotOk(err);
      done(err);
    });
  });
});