const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../../lib/app');
const request = chai.request(app);

describe('CRUD servers routes', () => {
  const testServer = {
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
  };

  it('POSTs a server', done => {
    request
      .post('/api/servers')
      .send(testServer)
      .then(res => {
        testServer._id = res.body._id;
        testServer.__v = res.body.__v;
        assert.deepEqual(res.body, testServer);
        done();
      })
      .catch(done);
  });

  it('GETs all servers', done => {
    request
      .get('/api/servers')
      .then(res => {
        assert.deepEqual(res.body[0], testServer);
        done();
      })
      .catch(done);
  });

});