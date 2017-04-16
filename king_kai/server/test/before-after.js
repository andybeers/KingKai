const connection = require('../lib/mongoose-setup');
const db = require('./db-connect');

before(db.drop());
after(() => connection.close());