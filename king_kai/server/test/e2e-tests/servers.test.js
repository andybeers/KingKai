const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../../lib/app');
const request = chai.request(app);

describe('CRUD servers routes', () => {
  const testServer = {
    HostInfo: {
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
    }
  };

  it('Ensures authorization on POST', done => {
    request
      .post('/api/servers')
      .send(testServer)
      .then(() => {
        done('Should not be 200 response.');
      })
      .catch(err => {
        assert.equal(err.status, 403);
        assert.equal(err.response.body.error, 'Unauthorized. No token provided.');
        done();
      });
  });

  it('Ensures good token on POST', done => {
    testServer.HandshakeSecret = 'hunter2';

    request
      .post('/api/servers')
      .send(testServer)
      .then(() => {
        done('Should not be 200 response.');
      })
      .catch(err => {
        assert.equal(err.status, 403);
        assert.equal(err.response.body.error, 'Unauthorized, bad token.');
        done();
      });
  });

  it('POSTs a server', done => {
    testServer.HandshakeSecret = 'john_wuz_here';

    request
      .post('/api/servers')
      .send(testServer)
      .then(res => {
        testServer.HostInfo._id = res.body._id;
        testServer.HostInfo.__v = res.body.__v;
        assert.deepEqual(res.body, testServer.HostInfo);
        done();
      })
      .catch(done);
  });

  it('GETs all servers', done => {
    request
      .get('/api/servers')
      .then(res => {
        assert.deepEqual(res.body[0], testServer.HostInfo);
        done();
      })
      .catch(done);
  });

});