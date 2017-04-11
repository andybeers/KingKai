const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);
const app = require('../lib/app');
const request = chai.request(app);

describe('Server runs', () => {

  it('Hello worlds', done => {
    request
      .get('/')
      .then(res => {
        console.log(res.body);
        assert.equal(res.body.message, 'Hello world!');
        done();
      })
      .catch(err => {
        console.log(err.message);
      });
  });

});