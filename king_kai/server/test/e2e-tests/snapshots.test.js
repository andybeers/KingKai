const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../../lib/app');
const request = chai.request(app);

describe('CRUD snapshot routes', () => {

  const testSnapshot = {
    HOST_ID: '98734789-dhfaslkdfkjl',
    disk: [
      {
        free: 58989510656,
        fstype: 'ext2/ext3',
        inodesFree: 5085321,
        inodesTotal: 6291456,
        inodesUsed: 1206135,
        inodesUsedPercent: 19.17099952697754,
        path: '/',
        total: 101236436992,
        used: 37080752128,
        usedPercent: 36.62787157447099
      }
    ],
    cpus: [
      {
        cpu: 'cpu0',
        guest: 0,
        guestNice: 0,
        idle: 785665.44,
        iowait: 2277.8,
        irq: 0,
        nice: 27.34,
        softirq: 43.86,
        steal: 0,
        stolen: 0,
        system: 23077.85,
        user: 12862.3
      },
      {
        cpu: 'cpu1',
        guest: 0,
        guestNice: 0,
        idle: 782419.27,
        iowait: 5683.62,
        irq: 0,
        nice: 56.58,
        softirq: 24.01,
        steal: 0,
        stolen: 0,
        system: 23142.52,
        user: 12597.23
      }
    ],
    memory: {
      swap: {
        free: 17031196672,
        sin: 1064960,
        sout: 13058048,
        total: 17043550208,
        used: 12353536,
        usedPercent: 0.07248217565728428
      },
      virtual: {
        active: 5091659776,
        available: 11725160448,
        buffers: 999510016,
        cached: 9637629952,
        dirty: 65536,
        free: 214999040,
        inactive: 9633255424,
        pagetables: 55451648,
        shared: 203276288,
        slab: 1610989568,
        swapcached: 634880,
        total: 16761954304,
        used: 5036793856,
        usedPercent: 30.04896544073051,
        wired: 0,
        writeback: 0,
        writebacktmp: 0
      }
    }
  };

  it('POSTs a snapshot', done => {
    request
      .post('/api/snapshots')
      .send(testSnapshot)
      .then(res => {
        testSnapshot._id = res.body._id;
        testSnapshot.__v = res.body.__v;
        assert.deepEqual(res.body, testSnapshot);
        done();
      })
      .catch(done);
  });

});