const connection = require('../lib/setup-mongoose');
const db = require('./db-connect');

before(db.drop());
after(() => connection.close());